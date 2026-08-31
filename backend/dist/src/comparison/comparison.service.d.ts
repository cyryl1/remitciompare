import { BaseProviderAdapter, ProviderQuote } from '../providers/interfaces/provider-adapter.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
export declare enum Priority {
    MOST_RECEIVED = "MOST_RECEIVED",
    FASTEST = "FASTEST",
    LOWEST_COST = "LOWEST_COST"
}
export interface ComparisonResult {
    recommended: ProviderQuote | null;
    allQuotes: ProviderQuote[];
    moneyLeftOnTable: number;
}
export declare class ComparisonService {
    private readonly adapters;
    private readonly prisma;
    private readonly logger;
    private readonly TIMEOUT_MS;
    constructor(adapters: BaseProviderAdapter[], prisma: PrismaService);
    compare(dto: CreateComparisonDto, userId?: string, anonymousSessionId?: string, persist?: boolean): Promise<ComparisonResult>;
    private persistComparison;
    private parseDeliverySpeed;
    private rankQuotes;
    private executeWithTimeout;
    private buildFailedQuote;
    getSnapshots(fromCurrency: string, toCurrency: string, hours?: number): Promise<{
        id: string;
        createdAt: Date;
        provider: string;
        sendAmount: number;
        exchangeRate: number;
        totalFees: number;
        recipientAmount: number;
        paymentMethod: string;
        fromCurrency: string;
        toCurrency: string;
        dataType: import("@prisma/client").$Enums.DataType;
    }[]>;
}
