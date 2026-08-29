import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ComparisonService } from '../comparison/comparison.service';
export declare class WeeklyComparisonWorkerService {
    private readonly prisma;
    private readonly emailService;
    private readonly comparisonService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, comparisonService: ComparisonService);
    sendWeeklyComparisons(): Promise<void>;
}
