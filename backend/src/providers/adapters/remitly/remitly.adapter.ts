import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

/**
 * MOCK ADAPTER — Replace with real Remitly API integration when available.
 * Remitly is known for promotional first-transfer offers and a tiered
 * fee structure (Economy vs Express).
 */
@Injectable()
export class RemitlyAdapter implements BaseProviderAdapter {
  readonly name = 'Remitly';
  private readonly logger = new Logger(RemitlyAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(
      `[MOCK] Fetching Remitly quote for ${request.sendAmount} ${request.sourceCurrency} → ${request.targetCurrency}`,
    );

    await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));

    // Remitly typically offers slightly lower rates but with promotional discounts
    const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
    // Slight rate variation (±0.8%)
    const rate = baseRate * (1 + (Math.random() - 0.5) * 0.016);

    // Remitly charges a percentage fee + fixed fee (Economy tier)
    const percentageFeeRate = 0.019; // 1.9%
    const fixedFee = 1.99;
    const percentageFee = parseFloat((request.sendAmount * percentageFeeRate).toFixed(2));
    const totalFees = parseFloat((fixedFee + percentageFee).toFixed(2));
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
        percentage: percentageFee,
        tax: 0,
        discount: 0,
        other: 0,
      },
      totalFees,
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: '3–5 Business Days',
      paymentMethod: 'BANK_TRANSFER',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };

    return quote;
  }

  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2050,
      'USD-NGN': 1600,
      'EUR-NGN': 1720,
      'CAD-NGN': 1170,
    };
    return rates[`${from}-${to}`] ?? 1580;
  }
}
