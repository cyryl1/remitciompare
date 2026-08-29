import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BaseProviderAdapter,
  QuoteRequest,
} from '../providers/interfaces/provider-adapter.interface';
import { PROVIDER_ADAPTERS } from '../providers/providers.module';
import { AlertsService } from '../alerts/alerts.service';

@Processor('snapshot-queue')
export class SnapshotProcessor extends WorkerHost {
  private readonly logger = new Logger(SnapshotProcessor.name);

  constructor(
    private prisma: PrismaService,
    private alertsService: AlertsService,
    @Inject(PROVIDER_ADAPTERS)
    private readonly adapters: BaseProviderAdapter[],
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { providerSlug, fromCurrency, toCurrency, sendAmount } = job.data;

    this.logger.debug(
      `Processing snapshot for ${providerSlug} ${fromCurrency}->${toCurrency}`,
    );

    // Find the correct adapter (case-insensitive)
    const adapter = this.adapters.find(
      (a) => a.name.toLowerCase() === providerSlug.toLowerCase(),
    );
    if (!adapter) {
      this.logger.warn(`No adapter found for provider: ${providerSlug}`);
      return;
    }

    const request: QuoteRequest = {
      sendAmount,
      sourceCurrency: fromCurrency,
      targetCurrency: toCurrency,
    };

    try {
      const quote = await adapter.getQuote(request);

      if (quote.status === 'SUCCESS') {
        // Save to DB
        await this.prisma.rateSnapshot.create({
          data: {
            provider: providerSlug,
            fromCurrency,
            toCurrency,
            sendAmount,
            exchangeRate: quote.exchangeRate,
            recipientAmount: quote.recipientAmount,
            totalFees: quote.totalFees,
            paymentMethod: quote.paymentMethod,
            dataType: 'LIVE',
          },
        });
        this.logger.log(
          `Snapshot saved for ${providerSlug}: ${quote.recipientAmount} ${toCurrency}`,
        );

        // Process alerts
        await this.alertsService.processAlerts(
          providerSlug,
          fromCurrency,
          toCurrency,
          sendAmount,
          quote.exchangeRate,
          quote.recipientAmount,
        );
      } else {
        this.logger.warn(
          `Quote for ${providerSlug} returned non-success status: ${quote.status}`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to process snapshot for ${providerSlug}: ${error.message}`,
      );
      throw error; // BullMQ will retry or move to failed depending on queue config
    }
  }
}
