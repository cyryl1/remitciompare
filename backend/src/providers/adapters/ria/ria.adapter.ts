import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

@Injectable()
export class RiaAdapter implements BaseProviderAdapter {
  readonly name = 'Ria';
  private readonly logger = new Logger(RiaAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(`[MOCK] Fetching Ria quote...`);
    await new Promise((r) => setTimeout(r, 45 + Math.random() * 60));
    const baseRate = this.getMockRate(
      request.sourceCurrency,
      request.targetCurrency,
    );
    const rate = baseRate * (1 - Math.random() * 0.015);
    const totalFees = 3.0;
    const recipientAmount = (request.sendAmount - totalFees) * rate;

    return {
      provider: this.name,
      sendAmount: request.sendAmount,
      sourceCurrency: request.sourceCurrency,
      targetCurrency: request.targetCurrency,
      exchangeRate: parseFloat(rate.toFixed(2)),
      grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
      fees: { fixed: totalFees, percentage: 0, tax: 0, discount: 0, other: 0 },
      totalFees,
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: '15 Minutes',
      paymentMethod: 'CASH_PICKUP',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };
  }

  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2050,
      'USD-NGN': 1600,
      'EUR-NGN': 1730,
      'CAD-NGN': 1180,
    };
    return rates[`${from}-${to}`] ?? 1590;
  }
}
