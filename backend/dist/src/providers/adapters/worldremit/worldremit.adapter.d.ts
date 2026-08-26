import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';
export declare class WorldRemitAdapter implements BaseProviderAdapter {
    readonly name = "WorldRemit";
    private readonly logger;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
    private getMockRate;
}
