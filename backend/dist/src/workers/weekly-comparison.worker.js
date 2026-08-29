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
var WeeklyComparisonWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyComparisonWorkerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const comparison_service_1 = require("../comparison/comparison.service");
let WeeklyComparisonWorkerService = WeeklyComparisonWorkerService_1 = class WeeklyComparisonWorkerService {
    prisma;
    emailService;
    comparisonService;
    logger = new common_1.Logger(WeeklyComparisonWorkerService_1.name);
    constructor(prisma, emailService, comparisonService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.comparisonService = comparisonService;
    }
    async sendWeeklyComparisons() {
        this.logger.debug('Running weekly comparison digest check...');
        const subscribedUsers = await this.prisma.user.findMany({
            where: {
                notificationSettings: {
                    comparisonNotifications: true,
                }
            },
            include: {
                savedRoutes: true,
            }
        });
        if (subscribedUsers.length === 0) {
            this.logger.debug('No users subscribed to weekly comparisons.');
            return;
        }
        for (const user of subscribedUsers) {
            if (user.savedRoutes.length === 0) {
                continue;
            }
            const emailData = [];
            try {
                for (const route of user.savedRoutes) {
                    const defaultSendAmount = 1000;
                    const comparisonResult = await this.comparisonService.compare({
                        sendAmount: defaultSendAmount,
                        sourceCurrency: route.fromCurrency,
                        targetCurrency: route.toCurrency,
                        fromCountry: route.fromCountry,
                        toCountry: route.toCountry,
                        priority: comparison_service_1.Priority.MOST_RECEIVED,
                    }, undefined, undefined, false);
                    if (comparisonResult.recommended) {
                        emailData.push({
                            fromCurrency: route.fromCurrency,
                            toCurrency: route.toCurrency,
                            sendAmount: defaultSendAmount,
                            bestProvider: comparisonResult.recommended.provider,
                            bestRecipientAmount: new Intl.NumberFormat('en-US').format(comparisonResult.recommended.recipientAmount),
                        });
                    }
                }
                if (emailData.length > 0) {
                    this.logger.log(`Sending weekly digest to user ${user.email}`);
                    await this.emailService.sendWeeklyComparisonEmail(user.email, emailData);
                }
            }
            catch (err) {
                this.logger.error(`Failed to process weekly digest for user ${user.email}: ${err.message}`);
            }
        }
    }
};
exports.WeeklyComparisonWorkerService = WeeklyComparisonWorkerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeeklyComparisonWorkerService.prototype, "sendWeeklyComparisons", null);
exports.WeeklyComparisonWorkerService = WeeklyComparisonWorkerService = WeeklyComparisonWorkerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        comparison_service_1.ComparisonService])
], WeeklyComparisonWorkerService);
//# sourceMappingURL=weekly-comparison.worker.js.map