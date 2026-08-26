import { ComparisonService } from '../comparison/comparison.service';
export declare class RatesController {
    private readonly comparisonService;
    constructor(comparisonService: ComparisonService);
    compare(sendAmount: string, sendCurrency: string, receiveCurrency: string): Promise<{
        providerId: string;
        providerName: string;
        providerSlug: string;
        providerLogo: string;
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
        badge: string | null;
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
}
