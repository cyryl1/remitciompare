import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private prisma: PrismaService) {}

  async getAlerts(userId: string) {
    return this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAlert(userId: string, data: any) {
    return this.prisma.alert.create({
      data: {
        userId,
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        targetRecipientAmount: data.targetRecipientAmount,
        sendAmount: data.sendAmount || 1000,
        priority: data.priority || 'MOST_RECEIVED',
      }
    });
  }

  async processAlerts(provider: string, fromCurrency: string, toCurrency: string, amount: number, rate: number, recipientAmount: number) {
    // This will be called by the worker
    this.logger.debug(`Checking alerts for ${fromCurrency}->${toCurrency}`);
    
    const activeAlerts = await this.prisma.alert.findMany({
      where: {
        status: 'ACTIVE',
        fromCurrency,
        toCurrency,
      }
    });

    for (const alert of activeAlerts) {
      if (alert.targetRecipientAmount && recipientAmount >= alert.targetRecipientAmount) {
        this.logger.log(`Alert triggered for user ${alert.userId}: Target ${alert.targetRecipientAmount}, Actual ${recipientAmount}`);
        // Send email (MVP stub)
      }
    }
  }
}
