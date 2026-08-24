export interface QuoteRequest {
  sendAmount: number;
  sourceCurrency: string; // e.g., 'GBP'
  targetCurrency: string; // e.g., 'NGN'
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
  /**
   * Unique name of the provider (e.g., 'Wise', 'Remitly')
   */
  readonly name: string;

  /**
   * Fetches a live quote from the provider's API.
   * RemitCompare does NOT recalculate the recipientAmount, the provider adapter is responsible for it.
   */
  getQuote(request: QuoteRequest): Promise<ProviderQuote>;
}
