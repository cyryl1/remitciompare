import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    getAlerts(req: any): Promise<{
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
    createAlert(req: any, body: any): Promise<{
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
}
