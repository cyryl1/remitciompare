import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { BaseProviderAdapter } from '../providers/interfaces/provider-adapter.interface';
import { AlertsService } from '../alerts/alerts.service';
export declare class SnapshotProcessor extends WorkerHost {
    private prisma;
    private alertsService;
    private readonly adapters;
    private readonly logger;
    constructor(prisma: PrismaService, alertsService: AlertsService, adapters: BaseProviderAdapter[]);
    process(job: Job<any, any, string>): Promise<any>;
}
