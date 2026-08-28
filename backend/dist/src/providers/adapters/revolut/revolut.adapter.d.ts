import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class RevolutAdapter implements BaseProviderAdapter {
    readonly name = "Revolut";
    private readonly logger;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
    private getMockRate;
}
