import { BaseProviderAdapter, QuoteRequest, ProviderQuote } from '../providers/interfaces/provider-adapter.interface';
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
    private readonly logger;
    private readonly TIMEOUT_MS;
    constructor(adapters: BaseProviderAdapter[]);
    compare(request: QuoteRequest, priority: Priority): Promise<ComparisonResult>;
    private rankQuotes;
    private executeWithTimeout;
    private buildFailedQuote;
}
