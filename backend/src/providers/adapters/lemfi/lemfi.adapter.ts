import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

/**
 * MOCK ADAPTER — Replace with real LemFi API integration when available.
 * LemFi targets the African diaspora with competitive NGN rates and
 * typically has lower fees than traditional providers.
 */
@Injectable()
export class LemFiAdapter implements BaseProviderAdapter {
  readonly name = 'LemFi';
  private readonly logger = new Logger(LemFiAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(
      `[MOCK] Fetching LemFi quote for ${request.sendAmount} ${request.sourceCurrency} → ${request.targetCurrency}`,
    );

    // Simulate a short network delay (50–150ms)
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));

    // LemFi is known for very competitive rates and low flat fees
    const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
    // Slight rate variation (±0.5%) to simulate live market spread
    const rate = baseRate * (1 + (Math.random() - 0.5) * 0.01);

    const fixedFee = 0.99; // LemFi often charges very low or zero fees
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
      deliveryEstimate: 'Instant',
      paymentMethod: 'BANK_TRANSFER',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      status: 'SUCCESS',
    };

    return quote;
  }

  private getMockRate(from: string, to: string): number {
    // Mid-market approximations — update periodically
    const rates: Record<string, number> = {
      'GBP-NGN': 2080,
      'USD-NGN': 1620,
      'EUR-NGN': 1750,
      'CAD-NGN': 1190,
    };
    return rates[`${from}-${to}`] ?? 1600;
  }
}
