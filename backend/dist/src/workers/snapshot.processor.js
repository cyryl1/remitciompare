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
var SnapshotProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const providers_module_1 = require("../providers/providers.module");
const alerts_service_1 = require("../alerts/alerts.service");
let SnapshotProcessor = SnapshotProcessor_1 = class SnapshotProcessor extends bullmq_1.WorkerHost {
    prisma;
    alertsService;
    adapters;
    logger = new common_1.Logger(SnapshotProcessor_1.name);
    constructor(prisma, alertsService, adapters) {
        super();
        this.prisma = prisma;
        this.alertsService = alertsService;
        this.adapters = adapters;
    }
    async process(job) {
        const { providerSlug, fromCurrency, toCurrency, sendAmount } = job.data;
        this.logger.debug(`Processing snapshot for ${providerSlug} ${fromCurrency}->${toCurrency}`);
        const adapter = this.adapters.find((a) => a.name.toLowerCase() === providerSlug.toLowerCase());
        if (!adapter) {
            this.logger.warn(`No adapter found for provider: ${providerSlug}`);
            return;
        }
        const request = {
            sendAmount,
            sourceCurrency: fromCurrency,
            targetCurrency: toCurrency,
        };
        try {
            const quote = await adapter.getQuote(request);
            if (quote.status === 'SUCCESS') {
                await this.prisma.rateSnapshot.create({
                    data: {
                        provider: providerSlug,
                        fromCurrency,
                        toCurrency,
                        sendAmount,
                        exchangeRate: quote.exchangeRate,
                        recipientAmount: quote.recipientAmount,
                        totalFees: quote.totalFees,
                        paymentMethod: quote.paymentMethod,
                        dataType: 'LIVE',
                    },
                });
                this.logger.log(`Snapshot saved for ${providerSlug}: ${quote.recipientAmount} ${toCurrency}`);
                await this.alertsService.processAlerts(providerSlug, fromCurrency, toCurrency, sendAmount, quote.exchangeRate, quote.recipientAmount);
            }
            else {
                this.logger.warn(`Quote for ${providerSlug} returned non-success status: ${quote.status}`);
                await this.prisma.quoteFailureLog.create({
                    data: {
                        provider: providerSlug,
                        errorType: 'API_ERROR',
                        errorDetail: `Provider returned non-success status: ${quote.status}`,
                        route: `${fromCurrency}-${toCurrency}`
                    }
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to process snapshot for ${providerSlug}: ${error.message}`);
            await this.prisma.quoteFailureLog.create({
                data: {
                    provider: providerSlug,
                    errorType: error.message.includes('timeout') ? 'TIMEOUT' : 'API_ERROR',
                    errorDetail: error.message,
                    route: `${fromCurrency}-${toCurrency}`
                }
            });
            throw error;
        }
    }
};
exports.SnapshotProcessor = SnapshotProcessor;
exports.SnapshotProcessor = SnapshotProcessor = SnapshotProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('snapshot-queue'),
    __param(2, (0, common_1.Inject)(providers_module_1.PROVIDER_ADAPTERS)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerts_service_1.AlertsService, Array])
], SnapshotProcessor);
//# sourceMappingURL=snapshot.processor.js.map