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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonController = void 0;
const common_1 = require("@nestjs/common");
const comparison_service_1 = require("./comparison.service");
const optional_jwt_guard_1 = require("../auth/guards/optional-jwt.guard");
const uuid_1 = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
let ComparisonController = class ComparisonController {
    comparisonService;
    prisma;
    constructor(comparisonService, prisma) {
        this.comparisonService = comparisonService;
        this.prisma = prisma;
    }
    async getHistory(req, page = '1', limit = '20') {
        const user = req.user;
        const anonymousSessionId = req.cookies?.anonymous_session;
        if (!user && !anonymousSessionId) {
            return {
                data: [],
                total: 0,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
        }
        const whereClause = user ? { userId: user.id } : { anonymousSessionId };
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const take = parseInt(limit, 10);
        const [comparisons, total] = await Promise.all([
            this.prisma.comparison.findMany({
                where: whereClause,
                include: { quotes: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.comparison.count({ where: whereClause }),
        ]);
        const data = comparisons.map((c) => {
            const bestQuote = c.quotes.length > 0
                ? c.quotes.reduce((prev, curr) => prev.recipientAmount > curr.recipientAmount ? prev : curr)
                : null;
            return {
                id: c.id,
                sendAmount: c.sendAmount,
                sendCurrency: c.fromCurrency,
                receiveCurrency: c.toCurrency,
                createdAt: c.createdAt.toISOString(),
                bestProviderName: bestQuote
                    ? bestQuote.provider.charAt(0).toUpperCase() +
                        bestQuote.provider.slice(1)
                    : 'Unknown',
                bestReceiveAmount: bestQuote ? bestQuote.recipientAmount : 0,
                results: c.quotes.map((q) => ({
                    providerId: q.provider,
                    providerName: q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
                    providerSlug: q.provider.toLowerCase(),
                    exchangeRate: q.exchangeRate,
                    fee: Number(q.totalFees),
                    receiveAmount: q.recipientAmount,
                    deliveryTime: q.deliveryEstimate || '1-3 days',
                    badge: q.isBestValue ? 'best_rate' : null,
                })),
            };
        });
        return { data, total, page: parseInt(page, 10), limit: take };
    }
    async getComparisonById(id) {
        const c = await this.prisma.comparison.findUnique({
            where: { id },
            include: { quotes: true },
        });
        if (!c)
            return null;
        return {
            id: c.id,
            sendAmount: c.sendAmount,
            sendCurrency: c.fromCurrency,
            receiveCurrency: c.toCurrency,
            createdAt: c.createdAt.toISOString(),
            results: c.quotes.map((q) => ({
                providerId: q.provider,
                providerName: q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
                providerSlug: q.provider.toLowerCase(),
                exchangeRate: q.exchangeRate,
                fee: Number(q.totalFees),
                receiveAmount: q.recipientAmount,
                deliveryTime: q.deliveryEstimate || '1-3 days',
                badge: q.isBestValue ? 'best_rate' : null,
            })),
        };
    }
    async saveComparison(payload, req, res) {
        const user = req.user;
        let anonymousSessionId = req.cookies?.anonymous_session;
        if (!user && !anonymousSessionId) {
            anonymousSessionId = (0, uuid_1.v4)();
            res.cookie('anonymous_session', anonymousSessionId, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
        }
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        const comparison = await this.prisma.comparison.create({
            data: {
                userId: user?.id,
                anonymousSessionId,
                fromCurrency: payload.sendCurrency,
                toCurrency: payload.receiveCurrency,
                fromCountry: 'GB',
                toCountry: 'NG',
                sendAmount: payload.sendAmount,
                priority: 'MOST_RECEIVED',
                staleAt: expirationDate,
                quotes: {
                    create: payload.results.map((q) => ({
                        provider: q.providerId,
                        exchangeRate: q.exchangeRate,
                        totalFees: q.fee,
                        recipientAmount: q.receiveAmount,
                        grossRecipientAmount: q.receiveAmount,
                        deliveryEstimate: q.deliveryTime,
                        paymentMethod: 'BANK_TRANSFER',
                        fees: {},
                        isBestValue: q.badge === 'best_rate',
                        status: 'SUCCESS',
                        quoteTimestamp: new Date(),
                    })),
                },
            },
            include: { quotes: true },
        });
        await this.prisma.activityLog.create({
            data: {
                userId: user?.id || null,
                action: 'QUOTE_SEARCH',
                entity: 'Comparison',
                entityId: comparison.id,
                metadata: {
                    fromCurrency: payload.sendCurrency,
                    toCurrency: payload.receiveCurrency,
                    sendAmount: payload.sendAmount,
                },
                ipAddress: req.ip,
            },
        });
        return {
            id: comparison.id,
            sendAmount: comparison.sendAmount,
            sendCurrency: comparison.fromCurrency,
            receiveCurrency: comparison.toCurrency,
            createdAt: comparison.createdAt.toISOString(),
            results: payload.results,
        };
    }
};
exports.ComparisonController = ComparisonController;
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get comparison history for logged in or anonymous user',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User history' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single comparison by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "getComparisonById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Save a comparison' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "saveComparison", null);
exports.ComparisonController = ComparisonController = __decorate([
    (0, swagger_1.ApiTags)('comparison'),
    (0, common_1.Controller)('api/comparison'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService,
        prisma_service_1.PrismaService])
], ComparisonController);
//# sourceMappingURL=comparison.controller.js.map