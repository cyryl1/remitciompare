import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getActivityLogs(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string | null;
        entityId: string | null;
        metadata: import(".prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
    }[]>;
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
}
