import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';

@Injectable()
export class RevolutAdapter implements BaseProviderAdapter {
  readonly name = 'Revolut';
  private readonly logger = new Logger(RevolutAdapter.name);

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    this.logger.debug(`[MOCK] Fetching Revolut quote for ${request.sendAmount}`);
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 80));
    const rate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
    // Revolut uses real mid-market rate but charges fees based on plan/weekend
    const fixedFee = 0;
    const percentageFee = request.sendAmount * 0.005; // 0.5% standard fee
    const totalFees = fixedFee + percentageFee;
    const recipientAmount = (request.sendAmount - totalFees) * rate;

    return {
      provider: this.name,
      sendAmount: request.sendAmount,
      sourceCurrency: request.sourceCurrency,
      targetCurrency: request.targetCurrency,
      exchangeRate: parseFloat(rate.toFixed(2)),
      grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
      fees: { fixed: fixedFee, percentage: parseFloat(percentageFee.toFixed(2)), tax: 0, discount: 0, other: 0 },
      totalFees: parseFloat(totalFees.toFixed(2)),
      recipientAmount: parseFloat(recipientAmount.toFixed(2)),
      deliveryEstimate: 'Instant',
      paymentMethod: 'BANK_TRANSFER',
      quoteTimestamp: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      status: 'SUCCESS',
    };
  }
  
  private getMockRate(from: string, to: string): number {
    const rates: Record<string, number> = {
      'GBP-NGN': 2085, 'USD-NGN': 1625, 'EUR-NGN': 1755, 'CAD-NGN': 1195,
    };
    return rates[`${from}-${to}`] ?? 1600;
  }
}
