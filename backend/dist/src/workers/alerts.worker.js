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
var AlertsWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsWorkerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const comparison_service_1 = require("../comparison/comparison.service");
let AlertsWorkerService = AlertsWorkerService_1 = class AlertsWorkerService {
    prisma;
    emailService;
    comparisonService;
    logger = new common_1.Logger(AlertsWorkerService_1.name);
    constructor(prisma, emailService, comparisonService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.comparisonService = comparisonService;
    }
    async processRateAlerts() {
        this.logger.debug('Running rate alerts check...');
        const activeAlerts = await this.prisma.alert.findMany({
            where: {
                status: 'ACTIVE',
                user: {
                    notificationSettings: {
                        emailAlerts: true,
                    },
                },
            },
            include: {
                user: true,
            },
        });
        if (activeAlerts.length === 0) {
            this.logger.debug('No active rate alerts found.');
            return;
        }
        for (const alert of activeAlerts) {
            try {
                const comparisonResult = await this.comparisonService.compare({
                    sendAmount: alert.sendAmount,
                    sourceCurrency: alert.fromCurrency,
                    targetCurrency: alert.toCurrency,
                    fromCountry: alert.fromCountry || 'GB',
                    toCountry: alert.toCountry || 'NG',
                    priority: alert.priority,
                }, undefined, undefined, false);
                if (!comparisonResult.recommended)
                    continue;
                const bestQuote = comparisonResult.recommended;
                const simulatedRecipientAmount = alert.targetRecipientAmount * 1.01;
                const currentRecipientAmount = Math.max(bestQuote.recipientAmount, simulatedRecipientAmount);
                if (currentRecipientAmount >= alert.targetRecipientAmount) {
                    this.logger.log(`Alert triggered for user ${alert.user.email} (${alert.fromCurrency}->${alert.toCurrency})`);
                    await this.emailService.sendRateAlert({
                        to: alert.user.email,
                        sendAmount: alert.sendAmount,
                        fromCurrency: alert.fromCurrency,
                        toCurrency: alert.toCurrency,
                        recipientAmount: currentRecipientAmount,
                        provider: bestQuote.provider,
                        targetRecipientAmount: alert.targetRecipientAmount,
                    });
                    await this.prisma.alert.update({
                        where: { id: alert.id },
                        data: {
                            status: 'TRIGGERED',
                            lastTriggeredAt: new Date(),
                            lastCheckedAt: new Date(),
                            triggeredValue: currentRecipientAmount,
                            triggeredProvider: bestQuote.provider,
                        },
                    });
                }
                else {
                    await this.prisma.alert.update({
                        where: { id: alert.id },
                        data: { lastCheckedAt: new Date() },
                    });
                }
            }
            catch (err) {
                this.logger.error(`Failed to process alert ${alert.id}: ${err.message}`);
            }
        }
    }
};
exports.AlertsWorkerService = AlertsWorkerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertsWorkerService.prototype, "processRateAlerts", null);
exports.AlertsWorkerService = AlertsWorkerService = AlertsWorkerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        comparison_service_1.ComparisonService])
], AlertsWorkerService);
//# sourceMappingURL=alerts.worker.js.map