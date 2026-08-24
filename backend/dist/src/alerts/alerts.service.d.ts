import { PrismaService } from '../prisma/prisma.service';
export declare class AlertsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAlerts(userId: string): Promise<{
        status: import("@prisma/client").$Enums.AlertStatus;
        sendAmount: number;
        paymentMethod: string | null;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: import("@prisma/client").$Enums.Priority;
        userId: string;
        targetRecipientAmount: number;
        providerPreference: string | null;
        lastCheckedAt: Date | null;
        lastTriggeredAt: Date | null;
        triggeredValue: number | null;
        triggeredProvider: string | null;
    }[]>;
    createAlert(userId: string, data: any): Promise<{
        status: import("@prisma/client").$Enums.AlertStatus;
        sendAmount: number;
        paymentMethod: string | null;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string | null;
        toCountry: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: import("@prisma/client").$Enums.Priority;
        userId: string;
        targetRecipientAmount: number;
        providerPreference: string | null;
        lastCheckedAt: Date | null;
        lastTriggeredAt: Date | null;
        triggeredValue: number | null;
        triggeredProvider: string | null;
    }>;
    processAlerts(provider: string, fromCurrency: string, toCurrency: string, amount: number, rate: number, recipientAmount: number): Promise<void>;
}
