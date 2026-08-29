import { Injectable, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  ProviderQuote,
  QuoteRequest,
} from '../../interfaces/provider-adapter.interface';
import axios from 'axios';

@Injectable()
export class WiseAdapter implements BaseProviderAdapter {
  readonly name = 'Wise';
  private readonly logger = new Logger(WiseAdapter.name);

  // We use the public affiliate/sandbox endpoints or production based on env.
  // For MVP, we will point to the Wise v3 quotes API.
  private readonly apiUrl = 'https://api.transferwise.com/v3/quotes';

  async getQuote(request: QuoteRequest): Promise<ProviderQuote> {
    try {
      this.logger.debug(
        `Fetching Wise quote for ${request.sendAmount} ${request.sourceCurrency} to ${request.targetCurrency}`,
      );

      const response = await axios.post(
        this.apiUrl,
        {
          sourceCurrency: request.sourceCurrency,
          targetCurrency: request.targetCurrency,
          sourceAmount: request.sendAmount,
          // For MVP, we default to bank transfer payouts
          payOut: 'BANK_TRANSFER',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WISE_API_KEY}`,
          },
          timeout: 4000, // Slightly under the 5s global timeout
        },
      );

      const data = response.data;

      // Wise usually returns an array of payment options in the quote response.
      // We will find the one corresponding to BANK_TRANSFER.
      const paymentOption =
        data.paymentOptions.find(
          (opt: any) =>
            opt.payIn === 'BANK_TRANSFER' && opt.payOut === 'BANK_TRANSFER',
        ) || data.paymentOptions[0];

      if (!paymentOption) {
        throw new Error('No valid payment options returned from Wise.');
      }

      const quote: ProviderQuote = {
        provider: this.name,
        sendAmount: request.sendAmount,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        exchangeRate: data.rate,
        grossRecipientAmount:
          paymentOption.targetAmount + paymentOption.fee.total, // Rough gross calculation
        fees: {
          fixed: paymentOption.fee.transferwise, // Wise uses 'transferwise' or 'total' for fees
          percentage: 0,
          tax: 0,
          discount: paymentOption.fee.discount || 0,
          other: 0,
        },
        totalFees: paymentOption.fee.total,
        recipientAmount: paymentOption.targetAmount,
        deliveryEstimate: paymentOption.estimatedDeliveryTime || 'Fast', // Format to string
        paymentMethod: paymentOption.payIn,
        quoteTimestamp: new Date(),
        expiresAt: new Date(data.expirationTime),
        status: 'SUCCESS',
      };

      return quote;
    } catch (error: any) {
      this.logger.error(`Failed to fetch quote from Wise: ${error.message}`);

      // We still return a ProviderQuote but with a FAILED status, so the engine knows it failed gracefully.
      return {
        provider: this.name,
        sendAmount: request.sendAmount,
        sourceCurrency: request.sourceCurrency,
        targetCurrency: request.targetCurrency,
        exchangeRate: 0,
        grossRecipientAmount: 0,
        fees: { fixed: 0, percentage: 0, tax: 0, discount: 0, other: 0 },
        totalFees: 0,
        recipientAmount: 0,
        deliveryEstimate: '',
        paymentMethod: '',
        quoteTimestamp: new Date(),
        expiresAt: null,
        status: 'FAILED',
      };
    }
  }
}
