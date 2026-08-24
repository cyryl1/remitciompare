import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnapshotProducer {
  private readonly logger = new Logger(SnapshotProducer.name);

  constructor(
    @InjectQueue('snapshot-queue') private snapshotQueue: Queue,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Run every hour. For testing, you could use CronExpression.EVERY_MINUTE
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running rate snapshot cron job...');

    // Fetch all active routes for all active and integrated providers
    const providers = await this.prisma.provider.findMany({
      where: {
        isActive: true,
        status: 'INTEGRATED',
      },
      include: {
        routes: {
          where: { isActive: true },
        },
      },
    });

    const sendAmount = this.configService.get<number>('RATE_SNAPSHOT_AMOUNT') || 1000;

    let jobCount = 0;
    for (const provider of providers) {
      for (const route of provider.routes) {
        await this.snapshotQueue.add('fetch-snapshot', {
          providerSlug: provider.slug,
          fromCurrency: route.fromCurrency,
          toCurrency: route.toCurrency,
          sendAmount,
        });
        jobCount++;
      }
    }

    this.logger.debug(`Queued ${jobCount} snapshot jobs.`);
  }
}
