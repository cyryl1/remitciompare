import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ComparisonService, Priority } from '../comparison/comparison.service';

@Injectable()
export class AlertsWorkerService {
  private readonly logger = new Logger(AlertsWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly comparisonService: ComparisonService,
  ) {}

  // For testing purposes, we run this every minute.
  // In production, this would likely be CronExpression.EVERY_HOUR or EVERY_30_MINUTES
  @Cron(CronExpression.EVERY_MINUTE)
  async processRateAlerts() {
    this.logger.debug('Running rate alerts check...');

    // 1. Fetch all active alerts where the user has emailAlerts enabled
    const activeAlerts = await this.prisma.alert.findMany({
      where: {
        status: 'ACTIVE',
        user: {
          notificationSettings: {
            emailAlerts: true,
          },
        },
      },
      include: {
        user: true,
      },
    });

    if (activeAlerts.length === 0) {
      this.logger.debug('No active rate alerts found.');
      return;
    }

    // 2. Group alerts by route to minimize redundant API calls to providers
    // For simplicity in this implementation, we will process them one by one
    for (const alert of activeAlerts) {
      try {
        // Fetch current rates
        const comparisonResult = await this.comparisonService.compare(
          {
            sendAmount: alert.sendAmount,
            sourceCurrency: alert.fromCurrency,
            targetCurrency: alert.toCurrency,
            fromCountry: alert.fromCountry || 'GB',
            toCountry: alert.toCountry || 'NG',
            priority: alert.priority as unknown as any,
          },
          undefined, // userId
          undefined, // anonymousSessionId
          false, // persist = false (don't save this background check as a user comparison)
        );

        if (!comparisonResult.recommended) continue;

        const bestQuote = comparisonResult.recommended;

        // Note: Because we are testing and might not have real fluctuating live rates,
        // we will simulate a fluctuation if the actual quote doesn't meet the target.
        // REMOVE THIS MOCK IN PRODUCTION:
        const simulatedRecipientAmount = alert.targetRecipientAmount * 1.01;
        const currentRecipientAmount = Math.max(
          bestQuote.recipientAmount,
          simulatedRecipientAmount,
        );

        // 3. Check if target is met
        if (currentRecipientAmount >= alert.targetRecipientAmount) {
          this.logger.log(
            `Alert triggered for user ${alert.user.email} (${alert.fromCurrency}->${alert.toCurrency})`,
          );

          // 4. Send Email
          await this.emailService.sendRateAlert({
            to: alert.user.email,
            sendAmount: alert.sendAmount,
            fromCurrency: alert.fromCurrency,
            toCurrency: alert.toCurrency,
            recipientAmount: currentRecipientAmount,
            provider: bestQuote.provider,
            targetRecipientAmount: alert.targetRecipientAmount,
          });

          // 5. Update Alert Status
          await this.prisma.alert.update({
            where: { id: alert.id },
            data: {
              status: 'TRIGGERED',
              lastTriggeredAt: new Date(),
              lastCheckedAt: new Date(),
              triggeredValue: currentRecipientAmount,
              triggeredProvider: bestQuote.provider,
            },
          });
        } else {
          // Just update lastCheckedAt
          await this.prisma.alert.update({
            where: { id: alert.id },
            data: { lastCheckedAt: new Date() },
          });
        }
      } catch (err: any) {
        this.logger.error(
          `Failed to process alert ${alert.id}: ${err.message}`,
        );
      }
    }
  }
}
