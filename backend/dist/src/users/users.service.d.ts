import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPreferences(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        countryOfResidence: string | null;
        defaultRoute: string | null;
        notificationSettings: {
            id: string;
            updatedAt: Date;
            userId: string;
            emailAlerts: boolean;
            comparisonNotifications: boolean;
            marketingEmails: boolean;
        } | null;
    } | null>;
    updatePreferences(userId: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        emailAlerts: boolean;
        comparisonNotifications: boolean;
        marketingEmails: boolean;
    }>;
}
