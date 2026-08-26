import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class RemitlyAdapter implements BaseProviderAdapter {
    readonly name = "Remitly";
    private readonly logger;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
    private getMockRate;
}
