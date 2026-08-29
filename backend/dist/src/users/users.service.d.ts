import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class UsersService {
    private prisma;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
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
    getSavedRoutes(userId: string): Promise<{
        id: string;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        userId: string;
        label: string | null;
    }[]>;
    addSavedRoute(userId: string, data: {
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        label?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        userId: string;
        label: string | null;
    }>;
    removeSavedRoute(userId: string, routeId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteAccount(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        fullName: string | null;
        avatarUrl: string | null;
        countryOfResidence: string | null;
        defaultRoute: string | null;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        passwordResetToken: string | null;
        passwordResetExpiry: Date | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    requestDataArchive(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
