import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getActivity(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string | null;
        entityId: string | null;
        metadata: import(".prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
    }[]>;
    getQuoteFailures(): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        errorType: string;
        route: string;
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
    updateProvider(id: string, body: any): Promise<{
        id: string;
        name: string;
        slug: string;
        isActive: boolean;
        isFeatured: boolean;
        lastRateUpdate: string;
        totalComparisons: number;
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
