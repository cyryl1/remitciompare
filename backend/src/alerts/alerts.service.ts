import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getAlerts(userId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return alerts.map((a) => ({
      id: a.id,
      sendCurrency: a.fromCurrency,
      receiveCurrency: a.toCurrency,
      sendAmount: a.sendAmount,
      condition: 'above', // Mocked or map properly
      targetRate: 0, // Mock or calculate
      targetReceiveAmount: a.targetRecipientAmount || 0,
      currentRate: 0,
      status: a.status.toLowerCase(),
      notifyEmail: true,
      notifyPush: false,
      createdAt: a.createdAt.toISOString(),
      triggeredAt: a.lastTriggeredAt?.toISOString(),
    }));
  }

  async createAlert(userId: string, data: any, ipAddress?: string) {
    const alert = await this.prisma.alert.create({
      data: {
        userId,
        fromCurrency: data.sendCurrency,
        toCurrency: data.receiveCurrency,
        targetRecipientAmount: data.targetReceiveAmount,
        sendAmount: data.sendAmount || 1000,
        priority: 'MOST_RECEIVED',
        status: 'ACTIVE',
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'ALERT_CREATED',
        entity: 'Alert',
        entityId: alert.id,
        ipAddress,
      },
    });

    return {
      id: alert.id,
      sendCurrency: alert.fromCurrency,
      receiveCurrency: alert.toCurrency,
      sendAmount: alert.sendAmount,
      condition: 'above',
      targetRate: 0,
      targetReceiveAmount: alert.targetRecipientAmount,
      status: alert.status.toLowerCase(),
      notifyEmail: data.notifyEmail ?? true,
      notifyPush: data.notifyPush ?? false,
      createdAt: alert.createdAt.toISOString(),
    };
  }

  async updateAlert(userId: string, id: string, data: any, ipAddress?: string) {
    const alert = await this.prisma.alert.update({
      where: { id, userId },
      data: {
        targetRecipientAmount: data.targetReceiveAmount,
        sendAmount: data.sendAmount,
        status: data.status ? data.status.toUpperCase() : undefined,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'ALERT_UPDATED',
        entity: 'Alert',
        entityId: id,
        ipAddress,
      },
    });

    return alert;
  }

  async deleteAlert(userId: string, id: string, ipAddress?: string) {
    const deleted = await this.prisma.alert.delete({
      where: { id, userId },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'ALERT_DELETED',
        entity: 'Alert',
        entityId: id,
        ipAddress,
      },
    });

    return deleted;
  }

  async toggleAlert(userId: string, id: string, ipAddress?: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id, userId } });
    if (!alert) throw new Error('Alert not found');

    const newStatus = alert.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const updated = await this.prisma.alert.update({
      where: { id },
      data: { status: newStatus as any },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'ALERT_TOGGLED',
        entity: 'Alert',
        entityId: id,
        metadata: { newStatus },
        ipAddress,
      },
    });

    return {
      ...updated,
      status: updated.status.toLowerCase(),
    };
  }

  async processAlerts(
    provider: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    rate: number,
    recipientAmount: number,
  ) {
    this.logger.debug(`Checking alerts for ${fromCurrency}->${toCurrency}`);

    const activeAlerts = await this.prisma.alert.findMany({
      where: {
        status: 'ACTIVE',
        fromCurrency,
        toCurrency,
      },
      include: { user: { select: { email: true } } },
    });

    for (const alert of activeAlerts) {
      if (
        alert.targetRecipientAmount &&
        recipientAmount >= alert.targetRecipientAmount
      ) {
        this.logger.log(
          `Alert ${alert.id} triggered for user ${alert.userId}: ` +
            `Target ${alert.targetRecipientAmount}, Actual ${recipientAmount} via ${provider}`,
        );

        // Update the alert record
        await this.prisma.alert.update({
          where: { id: alert.id },
          data: {
            lastTriggeredAt: new Date(),
            lastCheckedAt: new Date(),
            triggeredValue: recipientAmount,
            triggeredProvider: provider,
            status: 'TRIGGERED',
          },
        });

        await this.prisma.activityLog.create({
          data: {
            userId: alert.userId,
            action: 'ALERT_TRIGGERED',
            entity: 'Alert',
            entityId: alert.id,
            metadata: {
              provider,
              recipientAmount,
              targetAmount: alert.targetRecipientAmount,
            },
          },
        });

        // Send the alert email
        if (alert.user?.email) {
          await this.emailService.sendRateAlert({
            to: alert.user.email,
            sendAmount: alert.sendAmount,
            fromCurrency,
            toCurrency,
            recipientAmount,
            provider,
            targetRecipientAmount: alert.targetRecipientAmount,
          });
        }
      } else {
        // Just update the lastCheckedAt timestamp
        await this.prisma.alert.update({
          where: { id: alert.id },
          data: { lastCheckedAt: new Date() },
        });
      }
    }
  }
}
