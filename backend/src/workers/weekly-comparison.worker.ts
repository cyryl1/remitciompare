import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ComparisonService, Priority } from '../comparison/comparison.service';

@Injectable()
export class WeeklyComparisonWorkerService {
  private readonly logger = new Logger(WeeklyComparisonWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly comparisonService: ComparisonService,
  ) {}

  // For testing purposes, we run this every minute.
  // In production, this would likely be CronExpression.EVERY_WEEK or EVERY_DAY_AT_10AM
  @Cron(CronExpression.EVERY_MINUTE)
  async sendWeeklyComparisons() {
    this.logger.debug('Running weekly comparison digest check...');

    // 1. Fetch users with comparisonNotifications enabled
    const subscribedUsers = await this.prisma.user.findMany({
      where: {
        notificationSettings: {
          comparisonNotifications: true,
        }
      },
      include: {
        savedRoutes: true,
      }
    });

    if (subscribedUsers.length === 0) {
      this.logger.debug('No users subscribed to weekly comparisons.');
      return;
    }

    for (const user of subscribedUsers) {
      if (user.savedRoutes.length === 0) {
        continue; // They have no saved routes to compare
      }

      const emailData = [];

      try {
        for (const route of user.savedRoutes) {
          const defaultSendAmount = 1000; // Use a default amount for the digest

          const comparisonResult = await this.comparisonService.compare(
            {
              sendAmount: defaultSendAmount,
              sourceCurrency: route.fromCurrency,
              targetCurrency: route.toCurrency,
              fromCountry: route.fromCountry,
              toCountry: route.toCountry,
              priority: Priority.MOST_RECEIVED,
            },
            undefined, 
            undefined, 
            false
          );

          if (comparisonResult.recommended) {
            emailData.push({
              fromCurrency: route.fromCurrency,
              toCurrency: route.toCurrency,
              sendAmount: defaultSendAmount,
              bestProvider: comparisonResult.recommended.provider,
              bestRecipientAmount: new Intl.NumberFormat('en-US').format(comparisonResult.recommended.recipientAmount),
            });
          }
        }

        if (emailData.length > 0) {
          this.logger.log(`Sending weekly digest to user ${user.email}`);
          await this.emailService.sendWeeklyComparisonEmail(user.email, emailData);
        }

      } catch (err: any) {
        this.logger.error(`Failed to process weekly digest for user ${user.email}: ${err.message}`);
      }
    }
  }
}
