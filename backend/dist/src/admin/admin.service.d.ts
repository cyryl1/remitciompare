import { PrismaService } from '../prisma/prisma.service';
import { AlertsWorkerService } from '../workers/alerts.worker';
export declare class AdminService {
    private prisma;
    private alertsWorker;
    private readonly logger;
    constructor(prisma: PrismaService, alertsWorker: AlertsWorkerService);
    getQuoteFailures(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        errorType: string;
        route: string;
        errorDetail: string | null;
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
            status: import("@prisma/client").$Enums.AlertStatus;
            createdAt: Date;
            updatedAt: Date;
            sendAmount: number;
            paymentMethod: string | null;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string | null;
            toCountry: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            userId: string;
            targetRecipientAmount: number;
            providerPreference: string | null;
            lastCheckedAt: Date | null;
            lastTriggeredAt: Date | null;
            triggeredValue: number | null;
            triggeredProvider: string | null;
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
                status: import("@prisma/client").$Enums.QuoteStatus;
                provider: string;
                recipientAmount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            sendAmount: number;
            paymentMethod: string | null;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string;
            toCountry: string;
            priority: import("@prisma/client").$Enums.Priority;
            deliveryPreference: string | null;
            anonymousSessionId: string | null;
            staleAt: Date;
            userId: string | null;
        })[];
        total: number;
    }>;
    getRoutes(page: number, limit: number, search?: string): Promise<{
        data: ({
            provider: {
                slug: string;
                name: string;
                isActive: boolean;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
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
        isActive: boolean;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        providerId: string;
    }>;
    getReferralLinks(page: number, limit: number, search?: string): Promise<{
        data: {
            url: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            provider: string;
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
        url: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        provider: string;
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
            status: import("@prisma/client").$Enums.AlertStatus;
            createdAt: Date;
            updatedAt: Date;
            sendAmount: number;
            paymentMethod: string | null;
            fromCurrency: string;
            toCurrency: string;
            fromCountry: string | null;
            toCountry: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            userId: string;
            targetRecipientAmount: number;
            providerPreference: string | null;
            lastCheckedAt: Date | null;
            lastTriggeredAt: Date | null;
            triggeredValue: number | null;
            triggeredProvider: string | null;
        })[];
        total: number;
    }>;
    getHealthLogs(page: number, limit: number, search?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            provider: string;
            errorType: string;
            route: string;
            errorDetail: string | null;
        }[];
        total: number;
    }>;
    getActivityLogs(page: number, limit: number, search?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string | null;
            entityId: string | null;
            metadata: import(".prisma/client/runtime/client").JsonValue | null;
            ipAddress: string | null;
        }[];
        total: number;
    }>;
    createProvider(data: {
        name: string;
        slug: string;
        websiteUrl: string;
        isActive?: boolean;
        isFeatured?: boolean;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
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
        status: import("@prisma/client").$Enums.ProviderStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        isActive: boolean;
        createdAt: Date;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        providerId: string;
    }>;
    createReferralLink(data: {
        provider: string;
        url: string;
        utmSource?: string;
        utmCampaign?: string;
        utmMedium?: string;
        isActive?: boolean;
    }): Promise<{
        url: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        provider: string;
        utmSource: string | null;
        utmCampaign: string | null;
        clickCount: number;
    }>;
    triggerAlertCheck(): Promise<{
        message: string;
    }>;
}
