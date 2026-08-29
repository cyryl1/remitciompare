import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

@Injectable()
export class WesternUnionAdapter implements BaseProviderAdapter {
  readonly name = 'Western Union';
  private readonly logger = new Logger(WesternUnionAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(
      `[MOCK] Fetching Western Union quote for ${request.sendAmount} ${request.sourceCurrency} → ${request.targetCurrency}`,
    );
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
    const baseRate = this.getMockRate(
      request.sourceCurrency,
      request.targetCurrency,
    );
    const rate = baseRate * (1 + (Math.random() - 0.5) * 0.02); // Western union has variable margins
    const fixedFee = 4.99;
    const totalFees = fixedFee;
    const recipientAmount = (request.sendAmount - totalFees) * rate;

    return {
      provider: this.name,
      sendAmount: request.sendAmount,
      sourceCurrency: request.sourceCurrency,
      targetCurrency: request.targetCurrency,
      exchangeRate: parseFloat(rate.toFixed(2)),
      grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
      fees: { fixed: fixedFee, percentage: 0, tax: 0, discount: 0, other: 0 },
      totalFees,
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: 'Next Day',
      paymentMethod: 'CASH_PICKUP',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };
  }

  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2040,
      'USD-NGN': 1590,
      'EUR-NGN': 1720,
      'CAD-NGN': 1170,
    };
    return rates[`${from}-${to}`] ?? 1580;
  }
}
