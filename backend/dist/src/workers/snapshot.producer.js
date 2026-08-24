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
var SnapshotProducer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotProducer = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let SnapshotProducer = SnapshotProducer_1 = class SnapshotProducer {
    snapshotQueue;
    prisma;
    configService;
    logger = new common_1.Logger(SnapshotProducer_1.name);
    constructor(snapshotQueue, prisma, configService) {
        this.snapshotQueue = snapshotQueue;
        this.prisma = prisma;
        this.configService = configService;
    }
    async handleCron() {
        this.logger.debug('Running rate snapshot cron job...');
        const providers = await this.prisma.provider.findMany({
            where: {
                isActive: true,
                status: 'INTEGRATED',
            },
            include: {
                routes: {
                    where: { isActive: true },
                },
            },
        });
        const sendAmount = this.configService.get('RATE_SNAPSHOT_AMOUNT') || 1000;
        let jobCount = 0;
        for (const provider of providers) {
            for (const route of provider.routes) {
                await this.snapshotQueue.add('fetch-snapshot', {
                    providerSlug: provider.slug,
                    fromCurrency: route.fromCurrency,
                    toCurrency: route.toCurrency,
                    sendAmount,
                });
                jobCount++;
            }
        }
        this.logger.debug(`Queued ${jobCount} snapshot jobs.`);
    }
};
exports.SnapshotProducer = SnapshotProducer;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SnapshotProducer.prototype, "handleCron", null);
exports.SnapshotProducer = SnapshotProducer = SnapshotProducer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('snapshot-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], SnapshotProducer);
//# sourceMappingURL=snapshot.producer.js.map