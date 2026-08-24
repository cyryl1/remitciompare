export interface QuoteRequest {
    sendAmount: number;
    sourceCurrency: string;
    targetCurrency: string;
}
export interface ProviderQuote {
    provider: string;
    sendAmount: number;
    sourceCurrency: string;
    targetCurrency: string;
    exchangeRate: number;
    grossRecipientAmount: number;
    fees: {
        fixed: number;
        percentage: number;
        tax: number;
        discount: number;
        other: number;
    };
    totalFees: number;
    recipientAmount: number;
    deliveryEstimate: string;
    paymentMethod: string;
    quoteTimestamp: Date;
    expiresAt: Date | null;
    status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
}
export interface BaseProviderAdapter {
    readonly name: string;
    getQuote(request: QuoteRequest): Promise<ProviderQuote>;
}
