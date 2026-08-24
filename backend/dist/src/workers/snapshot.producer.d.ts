import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class SnapshotProducer {
    private snapshotQueue;
    private prisma;
    private configService;
    private readonly logger;
    constructor(snapshotQueue: Queue, prisma: PrismaService, configService: ConfigService);
    handleCron(): Promise<void>;
}
