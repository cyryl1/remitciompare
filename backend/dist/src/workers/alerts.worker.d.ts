import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ComparisonService } from '../comparison/comparison.service';
export declare class AlertsWorkerService {
    private readonly prisma;
    private readonly emailService;
    private readonly comparisonService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, comparisonService: ComparisonService);
    processRateAlerts(): Promise<void>;
}
