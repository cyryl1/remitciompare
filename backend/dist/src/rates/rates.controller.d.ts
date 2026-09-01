import { ComparisonService, Priority } from '../comparison/comparison.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class RatesController {
    private readonly comparisonService;
    private readonly prisma;
    constructor(comparisonService: ComparisonService, prisma: PrismaService);
    compare(amount: string, sendCurrency: string, receiveCurrency: string, priority?: Priority, providerSlug?: string): Promise<{
        providerId: string;
        providerName: string;
        providerSlug: string;
        providerLogo: any;
        handoffUrl: string;
        exchangeRate: number;
        fee: number;
        feeType: string;
        receiveAmount: number;
        deliveryTime: string;
        deliveryMethods: string[];
        transferLimit: {
            min: number;
            max: number;
        };
        updatedAt: string;
        status: "FAILED" | "TIMEOUT" | "SUCCESS";
        badges: string[];
    }[]>;
    getHistory(sendCurrency?: string, receiveCurrency?: string, days?: string): Promise<{
        date: string;
        rate: number;
        provider: string;
    }[]>;
    getLatest(sendCurrency?: string, receiveCurrency?: string): Promise<{
        rate: number;
        updatedAt: string;
    }>;
    handleReferralRedirect(slug: string): Promise<{
        url: string;
        statusCode: number;
    }>;
}
