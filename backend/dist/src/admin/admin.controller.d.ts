import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getActivity(): Promise<{
        id: string;
        userId: string | null;
        action: string;
        entity: string | null;
        entityId: string | null;
        metadata: import(".prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
        createdAt: Date;
    }[]>;
    getQuoteFailures(): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        route: string;
        errorType: string;
        errorDetail: string | null;
    }[]>;
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalComparisons: number;
        comparisonsToday: number;
        totalAlerts: number;
        activeAlerts: number;
        totalProviders: number;
        activeProviders: number;
        topCorridors: {
            from: string;
            to: string;
            count: number;
        }[];
        recentSignups: number;
        recentAlerts: ({
            user: {
                email: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.AlertStatus;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string | null;
            toCountry: string | null;
            sendAmount: number;
            targetRecipientAmount: number;
            priority: import("@prisma/client").$Enums.Priority;
            providerPreference: string | null;
            paymentMethod: string | null;
            lastCheckedAt: Date | null;
            lastTriggeredAt: Date | null;
            triggeredValue: number | null;
            triggeredProvider: string | null;
            updatedAt: Date;
        })[];
    }>;
    getProviders(page?: string, limit?: string): Promise<{
        data: {
            id: string;
            name: string;
            slug: string;
            isActive: boolean;
            isFeatured: boolean;
            lastRateUpdate: string;
            totalComparisons: number;
        }[];
        total: number;
    }>;
    updateProvider(id: string, updateData: {
        isActive?: boolean;
        isFeatured?: boolean;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
        isFeatured: boolean;
        lastRateUpdate: string;
        totalComparisons: number;
    }>;
    createProvider(data: {
        name: string;
        slug: string;
        websiteUrl?: string;
        isActive?: boolean;
        isFeatured?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProviderStatus;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        logoUrl: string | null;
        description: string | null;
        about: string | null;
        tagline: string | null;
        websiteUrl: string;
        affiliateUrl: string | null;
        trustpilotRating: number | null;
        trustpilotCount: number | null;
        regulatoryInfo: string | null;
        countriesSupported: number;
        currenciesSupported: number;
        paymentMethods: string[];
        payoutMethods: string[];
        deliveryMethods: string[];
        features: string[];
    }>;
    getQuotes(page?: string, limit?: string, search?: string): Promise<{
        data: ({
            user: {
                email: string;
                fullName: string | null;
            } | null;
            quotes: {
                provider: string;
                status: import("@prisma/client").$Enums.QuoteStatus;
                recipientAmount: number;
            }[];
        } & {
            id: string;
            userId: string | null;
            createdAt: Date;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string;
            toCountry: string;
            sendAmount: number;
            priority: import("@prisma/client").$Enums.Priority;
            paymentMethod: string | null;
            anonymousSessionId: string | null;
            deliveryPreference: string | null;
            staleAt: Date;
        })[];
        total: number;
    }>;
    getRoutes(page?: string, limit?: string, search?: string): Promise<{
        data: ({
            provider: {
                name: string;
                isActive: boolean;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string | null;
            toCountry: string | null;
            providerId: string;
        })[];
        total: number;
    }>;
    updateRoute(id: string, updateData: {
        isActive: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        providerId: string;
    }>;
    createRoute(data: {
        providerId: string;
        fromCurrency: string;
        toCurrency: string;
        fromCountry?: string;
        toCountry?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        providerId: string;
    }>;
    getReferralLinks(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            provider: string;
            isActive: boolean;
            updatedAt: Date;
            url: string;
            utmSource: string | null;
            utmCampaign: string | null;
            clickCount: number;
        }[];
        total: number;
    }>;
    updateReferralLink(id: string, updateData: {
        isActive?: boolean;
        url?: string;
        utmSource?: string;
        utmCampaign?: string;
        utmMedium?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        isActive: boolean;
        updatedAt: Date;
        url: string;
        utmSource: string | null;
        utmCampaign: string | null;
        clickCount: number;
    }>;
    createReferralLink(data: {
        providerId: string;
        url: string;
        utmSource?: string;
        utmCampaign?: string;
        utmMedium?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        isActive: boolean;
        updatedAt: Date;
        url: string;
        utmSource: string | null;
        utmCampaign: string | null;
        clickCount: number;
    }>;
    getAlerts(page?: string, limit?: string, search?: string): Promise<{
        data: ({
            user: {
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.AlertStatus;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string | null;
            toCountry: string | null;
            sendAmount: number;
            targetRecipientAmount: number;
            priority: import("@prisma/client").$Enums.Priority;
            providerPreference: string | null;
            paymentMethod: string | null;
            lastCheckedAt: Date | null;
            lastTriggeredAt: Date | null;
            triggeredValue: number | null;
            triggeredProvider: string | null;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    triggerAlertCheck(): Promise<{
        message: string;
    }>;
    getHealthLogs(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            provider: string;
            route: string;
            errorType: string;
            errorDetail: string | null;
        }[];
        total: number;
    }>;
    getActivityLogs(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: string;
            userId: string | null;
            action: string;
            entity: string | null;
            entityId: string | null;
            metadata: import(".prisma/client/runtime/client").JsonValue | null;
            ipAddress: string | null;
            createdAt: Date;
        }[];
        total: number;
    }>;
    getUsers(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: string;
            comparisonCount: number;
            alertCount: number;
        }[];
        total: number;
    }>;
    triggerRateRefresh(): Promise<{
        message: string;
    }>;
}
