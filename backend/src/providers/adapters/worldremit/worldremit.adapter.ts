import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

/**
 * MOCK ADAPTER — Replace with real WorldRemit API integration when available.
 * WorldRemit offers multiple payout options (bank deposit, cash pickup, mobile money)
 * and is known for broad corridor coverage.
 */
@Injectable()
export class WorldRemitAdapter implements BaseProviderAdapter {
  readonly name = 'WorldRemit';
  private readonly logger = new Logger(WorldRemitAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(
      `[MOCK] Fetching WorldRemit quote for ${request.sendAmount} ${request.sourceCurrency} → ${request.targetCurrency}`,
    );

    await new Promise((r) => setTimeout(r, 60 + Math.random() * 100));

    // WorldRemit is typically mid-market on rates with a fixed transfer fee
    const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
    // Slight rate variation (±1.0%)
    const rate = baseRate * (1 + (Math.random() - 0.5) * 0.02);

    const fixedFee = 3.99; // WorldRemit charges a flat fee per transfer
    const totalFees = fixedFee;
    const recipientAmount = (request.sendAmount - totalFees) * rate;

    const quote: ProviderQuote = {
      provider: this.name,
      sendAmount: request.sendAmount,
      sourceCurrency: request.sourceCurrency,
      targetCurrency: request.targetCurrency,
      exchangeRate: parseFloat(rate.toFixed(2)),
      grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
      fees: {
        fixed: fixedFee,
        percentage: 0,
        tax: 0,
        discount: 0,
        other: 0,
      },
      totalFees,
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: 'Within 2 Hours',
      paymentMethod: 'BANK_TRANSFER',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };

    return quote;
  }

  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2040,
      'USD-NGN': 1595,
      'EUR-NGN': 1710,
      'CAD-NGN': 1160,
    };
    return rates[`${from}-${to}`] ?? 1570;
  }
}
