import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseProviderAdapter, QuoteRequest, ProviderQuote } from '../providers/interfaces/provider-adapter.interface';
import { PROVIDER_ADAPTERS } from '../providers/providers.module';

export enum Priority {
  MOST_RECEIVED = 'MOST_RECEIVED',
  FASTEST = 'FASTEST',
  LOWEST_COST = 'LOWEST_COST'
}

export interface ComparisonResult {
  recommended: ProviderQuote | null;
  allQuotes: ProviderQuote[];
  moneyLeftOnTable: number; // For MVP: Diff between best and second best recipient amount
}

@Injectable()
export class ComparisonService {
  private readonly logger = new Logger(ComparisonService.name);
  
  // Hard 5-second timeout for progressive quote loading (OQ-1)
  private readonly TIMEOUT_MS = 5000;

  constructor(
    @Inject(PROVIDER_ADAPTERS)
    private readonly adapters: BaseProviderAdapter[]
  ) {}

  async compare(request: QuoteRequest, priority: Priority): Promise<ComparisonResult> {
    this.logger.debug(`Starting comparison for ${request.sendAmount} ${request.sourceCurrency}->${request.targetCurrency}. Priority: ${priority}`);

    // Fire all adapters concurrently
    const promises = this.adapters.map(adapter => 
      this.executeWithTimeout(adapter.getQuote(request), this.TIMEOUT_MS)
        .catch(err => {
          this.logger.error(`Adapter ${adapter.name} failed or timed out: ${err.message}`);
          return this.buildFailedQuote(adapter.name, request, 'TIMEOUT');
        })
    );

    const results = await Promise.all(promises);
    
    // Final ranking is deferred until all available providers have responded (or timed out)
    const successfulQuotes = results.filter(q => q.status === 'SUCCESS');
    
    // Sort based on the primary priority input
    successfulQuotes.sort((a, b) => this.rankQuotes(a, b, priority));

    const recommended = successfulQuotes.length > 0 ? successfulQuotes[0] : null;
    
    let moneyLeftOnTable = 0;
    if (successfulQuotes.length > 1) {
      // "Potential Savings" (D-16) calculation for the UI: difference between best and second best 
      const sortedByRecipient = [...successfulQuotes].sort((a, b) => b.recipientAmount - a.recipientAmount);
      moneyLeftOnTable = sortedByRecipient[0].recipientAmount - sortedByRecipient[1].recipientAmount;
    }

    return {
      recommended,
      allQuotes: results,
      moneyLeftOnTable
    };
  }

  private rankQuotes(a: ProviderQuote, b: ProviderQuote, priority: Priority): number {
    if (priority === Priority.MOST_RECEIVED) {
      return b.recipientAmount - a.recipientAmount; // Highest first
    } else if (priority === Priority.LOWEST_COST) {
      return a.totalFees - b.totalFees; // Lowest first
    } else if (priority === Priority.FASTEST) {
      // MVP fallback: we would need a normalized delivery time mapping for real sort.
      // Defaulting to Most Received if delivery times are unparseable strings.
      return b.recipientAmount - a.recipientAmount; 
    }
    return 0;
  }

  private executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error(`Quote timeout exceeded ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([
      promise,
      timeoutPromise
    ]).finally(() => clearTimeout(timeoutHandle));
  }

  private buildFailedQuote(providerName: string, request: QuoteRequest, status: 'FAILED' | 'TIMEOUT'): ProviderQuote {
    return {
      provider: providerName,
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
      status
    };
  }
}
