import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getActivityLogs(): Promise<never[]>;
    getQuoteFailures(): Promise<never[]>;
}
