import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class LemFiAdapter implements BaseProviderAdapter {
    readonly name = "LemFi";
    private readonly logger;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
    private getMockRate;
}
