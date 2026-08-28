import { Injectable, Logger } from '@nestjs/common';
import { BaseProviderAdapter, ProviderQuote, QuoteRequest } from '../../interfaces/provider-adapter.interface';

@Injectable()
export class SendwaveAdapter implements BaseProviderAdapter {
  readonly name = 'Sendwave';
  private readonly logger = new Logger(SendwaveAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(`[MOCK] Fetching Sendwave quote...`);
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 90));
    const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
    const rate = baseRate * 0.98; // Wider margin
    const totalFees = 0; // Zero fixed fees
    const recipientAmount = request.sendAmount * rate;

    return {
      provider: this.name,
      sendAmount: request.sendAmount,
      sourceCurrency: request.sourceCurrency,
      targetCurrency: request.targetCurrency,
      exchangeRate: parseFloat(rate.toFixed(2)),
      grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
      fees: { fixed: 0, percentage: 0, tax: 0, discount: 0, other: 0 },
      totalFees,
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: 'Instant',
      paymentMethod: 'MOBILE_MONEY',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };
  }
  
  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2075, 'USD-NGN': 1615, 'EUR-NGN': 1740, 'CAD-NGN': 1185,
    };
    return rates[`${from}-${to}`] ?? 1600;
  }
}
