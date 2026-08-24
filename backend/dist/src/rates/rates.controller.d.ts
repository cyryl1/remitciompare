import { ComparisonService } from '../comparison/comparison.service';
export declare class RatesController {
    private readonly comparisonService;
    constructor(comparisonService: ComparisonService);
    getSnapshots(source?: string, target?: string, hours?: string): Promise<{
        provider: string;
        sendAmount: number;
        exchangeRate: number;
        totalFees: number;
        recipientAmount: number;
        paymentMethod: string;
        fromCurrency: string;
        toCurrency: string;
        id: string;
        createdAt: Date;
        dataType: import("@prisma/client").$Enums.DataType;
    }[]>;
}
