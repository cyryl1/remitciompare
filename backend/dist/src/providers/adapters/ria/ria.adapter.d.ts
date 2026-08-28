import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class RiaAdapter implements BaseProviderAdapter {
    readonly name = "Ria";
    private readonly logger;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
    private getMockRate;
}
