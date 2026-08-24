import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class WiseAdapter implements BaseProviderAdapter {
    readonly name = "Wise";
    private readonly logger;
    private readonly apiUrl;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
}
