import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  BaseProviderAdapter,
  QuoteRequest,
  ProviderQuote,
} from '../providers/interfaces/provider-adapter.interface';
import { PROVIDER_ADAPTERS } from '../providers/providers.module';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateComparisonDto } from './dto/create-comparison.dto';

export enum Priority {
  MOST_RECEIVED = 'MOST_RECEIVED',
  FASTEST = 'FASTEST',
  LOWEST_COST = 'LOWEST_COST',
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
    private readonly adapters: BaseProviderAdapter[],
    private readonly prisma: PrismaService,
  ) {}

  async compare(
    dto: CreateComparisonDto,
    userId?: string,
    anonymousSessionId?: string,
    persist: boolean = true,
  ): Promise<ComparisonResult> {
    this.logger.debug(
      `Starting comparison for ${dto.sendAmount} ${dto.sourceCurrency}->${dto.targetCurrency}. Priority: ${dto.priority}`,
    );

    // Pre-flight check: Get active providers for this route
    let activeProviders = await this.prisma.provider.findMany({
      where: {
        isActive: true,
        status: 'INTEGRATED',
      },
      select: { slug: true },
    });
    
    if (dto.providerSlug) {
      activeProviders = activeProviders.filter(p => p.slug === dto.providerSlug);
    }

    const activeSlugs = new Set(
      activeProviders.map((p) => p.slug.toLowerCase()),
    );

    // Filter adapters
    const activeAdapters = this.adapters.filter((adapter) => {
      const adapterSlug = adapter.name.toLowerCase().replace(/\s+/g, '');
      return activeSlugs.has(adapterSlug);
    });

    const request: QuoteRequest = {
      sendAmount: dto.sendAmount,
      sourceCurrency: dto.sourceCurrency,
      targetCurrency: dto.targetCurrency,
    };

    // Fire all active adapters concurrently
    const promises = activeAdapters.map((adapter) =>
      this.executeWithTimeout(adapter.getQuote(request), this.TIMEOUT_MS).catch(
        async (err) => {
          this.logger.error(
            `Adapter ${adapter.name} failed or timed out: ${err.message}`,
          );
          
          await this.prisma.quoteFailureLog.create({
            data: {
              provider: adapter.name.toLowerCase(),
              errorType: err.message.includes('timeout') ? 'TIMEOUT' : 'API_ERROR',
              errorDetail: err.message,
              route: `${request.sourceCurrency}-${request.targetCurrency}`
            }
          });

          return this.buildFailedQuote(adapter.name, request, 'TIMEOUT');
        },
      ),
    );

    const results = await Promise.all(promises);

    // Final ranking is deferred until all available providers have responded (or timed out)
    const successfulQuotes = results.filter((q) => q.status === 'SUCCESS');

    // Sort based on the primary priority input
    successfulQuotes.sort((a, b) => this.rankQuotes(a, b, dto.priority!));

    const recommended =
      successfulQuotes.length > 0 ? successfulQuotes[0] : null;

    let moneyLeftOnTable = 0;
    if (successfulQuotes.length > 1) {
      const sortedByRecipient = [...successfulQuotes].sort(
        (a, b) => b.recipientAmount - a.recipientAmount,
      );
      moneyLeftOnTable =
        sortedByRecipient[0].recipientAmount -
        sortedByRecipient[1].recipientAmount;
    }

    // Persist comparison to DB
    if (persist) {
      await this.persistComparison(
        dto,
        results,
        recommended,
        userId,
        anonymousSessionId,
      );
    }

    return {
      recommended,
      allQuotes: results,
      moneyLeftOnTable,
    };
  }

  private async persistComparison(
    dto: CreateComparisonDto,
    results: ProviderQuote[],
    recommended: ProviderQuote | null,
    userId?: string,
    anonymousSessionId?: string,
  ) {
    try {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // staleAt in 1 hour

      await this.prisma.comparison.create({
        data: {
          userId,
          anonymousSessionId,
          fromCurrency: dto.sourceCurrency,
          toCurrency: dto.targetCurrency,
          fromCountry: dto.fromCountry!,
          toCountry: dto.toCountry!,
          sendAmount: dto.sendAmount,
          priority: dto.priority as any,
          paymentMethod: dto.paymentMethod,
          deliveryPreference: dto.deliveryPreference,
          staleAt: expirationDate,
          quotes: {
            create: results.map((q) => ({
              provider: q.provider,
              exchangeRate: q.exchangeRate,
              fees: q.fees,
              totalFees: q.totalFees,
              grossRecipientAmount: q.grossRecipientAmount,
              recipientAmount: q.recipientAmount,
              deliveryEstimate: q.deliveryEstimate,
              paymentMethod: q.paymentMethod,
              isBestValue: recommended?.provider === q.provider,
              status: q.status as any,
              errorType:
                q.status === 'TIMEOUT'
                  ? 'TIMEOUT'
                  : q.status === 'FAILED'
                    ? 'API_ERROR'
                    : null,
              quoteTimestamp: q.quoteTimestamp,
              expiresAt: q.expiresAt,
            })),
          },
        },
      });
    } catch (err) {
      this.logger.error(`Failed to persist comparison to DB: ${err.message}`);
    }
  }

  private parseDeliverySpeed(estimate: string): number {
    if (!estimate) return 99999;
    const text = estimate.toLowerCase();
    if (text.includes('instant')) return 0;
    if (text.includes('minute')) {
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 30;
    }
    if (text.includes('hour')) {
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) * 60 : 120;
    }
    if (text.includes('same day') || text.includes('today')) return 12 * 60;
    if (text.includes('next day') || text.includes('tomorrow')) return 24 * 60;
    if (text.includes('day')) {
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) * 24 * 60 : 48 * 60;
    }
    return 99999;
  }

  private rankQuotes(
    a: ProviderQuote,
    b: ProviderQuote,
    priority: Priority,
  ): number {
    if (priority === Priority.MOST_RECEIVED) {
      return b.recipientAmount - a.recipientAmount; // Highest first
    } else if (priority === Priority.LOWEST_COST) {
      return a.totalFees - b.totalFees; // Lowest first
    } else if (priority === Priority.FASTEST) {
      const aSpeed = this.parseDeliverySpeed(a.deliveryEstimate);
      const bSpeed = this.parseDeliverySpeed(b.deliveryEstimate);
      if (aSpeed === bSpeed) {
        return b.recipientAmount - a.recipientAmount; // Tie breaker
      }
      return aSpeed - bSpeed;
    }
    return 0;
  }

  private executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error(`Quote timeout exceeded ${timeoutMs}ms`)),
        timeoutMs,
      );
    });

    return Promise.race([promise, timeoutPromise]).finally(() =>
      clearTimeout(timeoutHandle),
    );
  }

  private buildFailedQuote(
    providerName: string,
    request: QuoteRequest,
    status: 'FAILED' | 'TIMEOUT',
  ): ProviderQuote {
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
      status,
    };
  }

  async getSnapshots(
    fromCurrency: string,
    toCurrency: string,
    hours: number = 24,
  ) {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - hours);

    return this.prisma.rateSnapshot.findMany({
      where: {
        fromCurrency,
        toCurrency,
        createdAt: {
          gte: timeLimit,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
