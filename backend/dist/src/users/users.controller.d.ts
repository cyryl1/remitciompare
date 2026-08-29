import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getPreferences(req: any): Promise<{
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
    updatePreferences(req: any, body: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        emailAlerts: boolean;
        comparisonNotifications: boolean;
        marketingEmails: boolean;
    }>;
    deleteAccount(req: any): Promise<{
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
    requestDataArchive(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getSavedRoutes(req: any): Promise<{
        id: string;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        userId: string;
        label: string | null;
    }[]>;
    addSavedRoute(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        userId: string;
        label: string | null;
    }>;
    removeSavedRoute(req: any, routeId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
