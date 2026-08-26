"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ComparisonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonService = exports.Priority = void 0;
const common_1 = require("@nestjs/common");
const providers_module_1 = require("../providers/providers.module");
const prisma_service_1 = require("../prisma/prisma.service");
var Priority;
(function (Priority) {
    Priority["MOST_RECEIVED"] = "MOST_RECEIVED";
    Priority["FASTEST"] = "FASTEST";
    Priority["LOWEST_COST"] = "LOWEST_COST";
})(Priority || (exports.Priority = Priority = {}));
let ComparisonService = ComparisonService_1 = class ComparisonService {
    adapters;
    prisma;
    logger = new common_1.Logger(ComparisonService_1.name);
    TIMEOUT_MS = 5000;
    constructor(adapters, prisma) {
        this.adapters = adapters;
        this.prisma = prisma;
    }
    async compare(dto, userId, anonymousSessionId, persist = true) {
        this.logger.debug(`Starting comparison for ${dto.sendAmount} ${dto.sourceCurrency}->${dto.targetCurrency}. Priority: ${dto.priority}`);
        const activeProviders = await this.prisma.provider.findMany({
            where: {
                isActive: true,
                status: 'INTEGRATED',
                routes: {
                    some: {
                        fromCurrency: dto.sourceCurrency,
                        toCurrency: dto.targetCurrency,
                        isActive: true,
                    }
                }
            },
            select: { slug: true }
        });
        const activeSlugs = new Set(activeProviders.map(p => p.slug.toLowerCase()));
        const activeAdapters = this.adapters.filter(adapter => activeSlugs.has(adapter.name.toLowerCase()));
        const request = {
            sendAmount: dto.sendAmount,
            sourceCurrency: dto.sourceCurrency,
            targetCurrency: dto.targetCurrency,
        };
        const promises = activeAdapters.map(adapter => this.executeWithTimeout(adapter.getQuote(request), this.TIMEOUT_MS)
            .catch(err => {
            this.logger.error(`Adapter ${adapter.name} failed or timed out: ${err.message}`);
            return this.buildFailedQuote(adapter.name, request, 'TIMEOUT');
        }));
        const results = await Promise.all(promises);
        const successfulQuotes = results.filter(q => q.status === 'SUCCESS');
        successfulQuotes.sort((a, b) => this.rankQuotes(a, b, dto.priority));
        const recommended = successfulQuotes.length > 0 ? successfulQuotes[0] : null;
        let moneyLeftOnTable = 0;
        if (successfulQuotes.length > 1) {
            const sortedByRecipient = [...successfulQuotes].sort((a, b) => b.recipientAmount - a.recipientAmount);
            moneyLeftOnTable = sortedByRecipient[0].recipientAmount - sortedByRecipient[1].recipientAmount;
        }
        if (persist) {
            await this.persistComparison(dto, results, recommended, userId, anonymousSessionId);
        }
        return {
            recommended,
            allQuotes: results,
            moneyLeftOnTable
        };
    }
    async persistComparison(dto, results, recommended, userId, anonymousSessionId) {
        try {
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1);
            await this.prisma.comparison.create({
                data: {
                    userId,
                    anonymousSessionId,
                    fromCurrency: dto.sourceCurrency,
                    toCurrency: dto.targetCurrency,
                    fromCountry: dto.fromCountry,
                    toCountry: dto.toCountry,
                    sendAmount: dto.sendAmount,
                    priority: dto.priority,
                    paymentMethod: dto.paymentMethod,
                    deliveryPreference: dto.deliveryPreference,
                    staleAt: expirationDate,
                    quotes: {
                        create: results.map(q => ({
                            provider: q.provider,
                            exchangeRate: q.exchangeRate,
                            fees: q.fees,
                            totalFees: q.totalFees,
                            grossRecipientAmount: q.grossRecipientAmount,
                            recipientAmount: q.recipientAmount,
                            deliveryEstimate: q.deliveryEstimate,
                            paymentMethod: q.paymentMethod,
                            isBestValue: recommended?.provider === q.provider,
                            status: q.status,
                            errorType: q.status === 'TIMEOUT' ? 'TIMEOUT' : (q.status === 'FAILED' ? 'API_ERROR' : null),
                            quoteTimestamp: q.quoteTimestamp,
                            expiresAt: q.expiresAt,
                        }))
                    }
                }
            });
        }
        catch (err) {
            this.logger.error(`Failed to persist comparison to DB: ${err.message}`);
        }
    }
    rankQuotes(a, b, priority) {
        if (priority === Priority.MOST_RECEIVED) {
            return b.recipientAmount - a.recipientAmount;
        }
        else if (priority === Priority.LOWEST_COST) {
            return a.totalFees - b.totalFees;
        }
        else if (priority === Priority.FASTEST) {
            return b.recipientAmount - a.recipientAmount;
        }
        return 0;
    }
    executeWithTimeout(promise, timeoutMs) {
        let timeoutHandle;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error(`Quote timeout exceeded ${timeoutMs}ms`)), timeoutMs);
        });
        return Promise.race([
            promise,
            timeoutPromise
        ]).finally(() => clearTimeout(timeoutHandle));
    }
    buildFailedQuote(providerName, request, status) {
        return {
            provider: providerName,
            sendAmount: request.sendAmount,
            sourceCurrency: request.sourceCurrency,
            targetCurrency: request.targetCurrency,
            exchangeRate: 0,
            grossRecipientAmount: 0,
            fees: { fixed: 0, percentage: 0, tax: 0, discount: 0, other: 0 },
            totalFees: 0,
            recipientAmount: 0,
            deliveryEstimate: '',
            paymentMethod: '',
            quoteTimestamp: new Date(),
            expiresAt: null,
            status
        };
    }
    async getSnapshots(fromCurrency, toCurrency, hours = 24) {
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - hours);
        return this.prisma.rateSnapshot.findMany({
            where: {
                fromCurrency,
                toCurrency,
                createdAt: {
                    gte: timeLimit,
                }
            },
            orderBy: {
                createdAt: 'asc',
            }
        });
    }
};
exports.ComparisonService = ComparisonService;
exports.ComparisonService = ComparisonService = ComparisonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_module_1.PROVIDER_ADAPTERS)),
    __metadata("design:paramtypes", [Array, prisma_service_1.PrismaService])
], ComparisonService);
//# sourceMappingURL=comparison.service.js.map