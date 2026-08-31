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
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AlertsService = AlertsService_1 = class AlertsService {
    prisma;
    emailService;
    logger = new common_1.Logger(AlertsService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async getAlerts(userId) {
        const alerts = await this.prisma.alert.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return alerts.map((a) => ({
            id: a.id,
            sendCurrency: a.fromCurrency,
            receiveCurrency: a.toCurrency,
            sendAmount: a.sendAmount,
            condition: 'above',
            targetRate: 0,
            targetReceiveAmount: a.targetRecipientAmount || 0,
            currentRate: 0,
            status: a.status.toLowerCase(),
            notifyEmail: true,
            notifyPush: false,
            createdAt: a.createdAt.toISOString(),
            triggeredAt: a.lastTriggeredAt?.toISOString(),
        }));
    }
    async createAlert(userId, data, ipAddress) {
        const alert = await this.prisma.alert.create({
            data: {
                userId,
                fromCurrency: data.sendCurrency,
                toCurrency: data.receiveCurrency,
                targetRecipientAmount: data.targetReceiveAmount,
                sendAmount: data.sendAmount || 1000,
                priority: 'MOST_RECEIVED',
                status: 'ACTIVE',
            },
        });
        await this.prisma.activityLog.create({
            data: {
                userId,
                action: 'ALERT_CREATED',
                entity: 'Alert',
                entityId: alert.id,
                ipAddress,
            },
        });
        return {
            id: alert.id,
            sendCurrency: alert.fromCurrency,
            receiveCurrency: alert.toCurrency,
            sendAmount: alert.sendAmount,
            condition: 'above',
            targetRate: 0,
            targetReceiveAmount: alert.targetRecipientAmount,
            status: alert.status.toLowerCase(),
            notifyEmail: data.notifyEmail ?? true,
            notifyPush: data.notifyPush ?? false,
            createdAt: alert.createdAt.toISOString(),
        };
    }
    async updateAlert(userId, id, data, ipAddress) {
        const alert = await this.prisma.alert.update({
            where: { id, userId },
            data: {
                targetRecipientAmount: data.targetReceiveAmount,
                sendAmount: data.sendAmount,
                status: data.status ? data.status.toUpperCase() : undefined,
            },
        });
        await this.prisma.activityLog.create({
            data: {
                userId,
                action: 'ALERT_UPDATED',
                entity: 'Alert',
                entityId: id,
                ipAddress,
            },
        });
        return alert;
    }
    async deleteAlert(userId, id, ipAddress) {
        const deleted = await this.prisma.alert.delete({
            where: { id, userId },
        });
        await this.prisma.activityLog.create({
            data: {
                userId,
                action: 'ALERT_DELETED',
                entity: 'Alert',
                entityId: id,
                ipAddress,
            },
        });
        return deleted;
    }
    async toggleAlert(userId, id, ipAddress) {
        const alert = await this.prisma.alert.findUnique({ where: { id, userId } });
        if (!alert)
            throw new Error('Alert not found');
        const newStatus = alert.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        const updated = await this.prisma.alert.update({
            where: { id },
            data: { status: newStatus },
        });
        await this.prisma.activityLog.create({
            data: {
                userId,
                action: 'ALERT_TOGGLED',
                entity: 'Alert',
                entityId: id,
                metadata: { newStatus },
                ipAddress,
            },
        });
        return {
            ...updated,
            status: updated.status.toLowerCase(),
        };
    }
    async processAlerts(provider, fromCurrency, toCurrency, amount, rate, recipientAmount) {
        this.logger.debug(`Checking alerts for ${fromCurrency}->${toCurrency}`);
        const activeAlerts = await this.prisma.alert.findMany({
            where: {
                status: 'ACTIVE',
                fromCurrency,
                toCurrency,
            },
            include: { user: { select: { email: true } } },
        });
        for (const alert of activeAlerts) {
            if (alert.targetRecipientAmount &&
                recipientAmount >= alert.targetRecipientAmount) {
                this.logger.log(`Alert ${alert.id} triggered for user ${alert.userId}: ` +
                    `Target ${alert.targetRecipientAmount}, Actual ${recipientAmount} via ${provider}`);
                await this.prisma.alert.update({
                    where: { id: alert.id },
                    data: {
                        lastTriggeredAt: new Date(),
                        lastCheckedAt: new Date(),
                        triggeredValue: recipientAmount,
                        triggeredProvider: provider,
                        status: 'TRIGGERED',
                    },
                });
                await this.prisma.activityLog.create({
                    data: {
                        userId: alert.userId,
                        action: 'ALERT_TRIGGERED',
                        entity: 'Alert',
                        entityId: alert.id,
                        metadata: {
                            provider,
                            recipientAmount,
                            targetAmount: alert.targetRecipientAmount,
                        },
                    },
                });
                if (alert.user?.email) {
                    await this.emailService.sendRateAlert({
                        to: alert.user.email,
                        sendAmount: alert.sendAmount,
                        fromCurrency,
                        toCurrency,
                        recipientAmount,
                        provider,
                        targetRecipientAmount: alert.targetRecipientAmount,
                    });
                }
            }
            else {
                await this.prisma.alert.update({
                    where: { id: alert.id },
                    data: { lastCheckedAt: new Date() },
                });
            }
        }
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map