import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getQuoteFailures(limit?: number): Promise<{
        id: string;
        provider: string;
        route: string;
        errorType: string;
        errorDetail: string | null;
        createdAt: Date;
    }[]>;
    getDashboardStats(): Promise<{
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
            createdAt: Date;
            status: import("@prisma/client").$Enums.AlertStatus;
            userId: string;
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
    getProviders(page: number, limit: number): Promise<{
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
    updateProvider(id: string, data: any): Promise<{
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
        isFeatured: boolean;
        lastRateUpdate: string;
        totalComparisons: number;
    }>;
    getUsers(page: number, limit: number, search?: string): Promise<{
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
    getQuotes(page: number, limit: number, search?: string): Promise<{
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
            createdAt: Date;
            userId: string | null;
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
    getRoutes(page: number, limit: number, search?: string): Promise<{
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
    updateRoute(id: string, data: {
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
    getReferralLinks(page: number, limit: number, search?: string): Promise<{
        data: {
            id: string;
            provider: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            url: string;
            utmSource: string | null;
            utmCampaign: string | null;
            clickCount: number;
        }[];
        total: number;
    }>;
    updateReferralLink(id: string, data: {
        isActive?: boolean;
        url?: string;
    }): Promise<{
        id: string;
        provider: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        url: string;
        utmSource: string | null;
        utmCampaign: string | null;
        clickCount: number;
    }>;
    getAlerts(page: number, limit: number, search?: string): Promise<{
        data: ({
            user: {
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.AlertStatus;
            userId: string;
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
    getHealthLogs(page: number, limit: number, search?: string): Promise<{
        data: {
            id: string;
            provider: string;
            route: string;
            errorType: string;
            errorDetail: string | null;
            createdAt: Date;
        }[];
        total: number;
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
    createReferralLink(data: {
        providerId: string;
        url: string;
        utmSource?: string;
        utmCampaign?: string;
        utmMedium?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        provider: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        url: string;
        utmSource: string | null;
        utmCampaign: string | null;
        clickCount: number;
    }>;
    triggerAlertCheck(): Promise<{
        message: string;
    }>;
}
