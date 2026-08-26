import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        defaultRoute: true,
        countryOfResidence: true,
        notificationSettings: true,
      },
    });
    return user;
  }

  async updatePreferences(userId: string, data: any) {
    const { emailAlerts, comparisonNotifications, marketingEmails, defaultRoute, countryOfResidence } = data;

    // Update top-level user fields if provided
    if (defaultRoute !== undefined || countryOfResidence !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(defaultRoute !== undefined && { defaultRoute }),
          ...(countryOfResidence !== undefined && { countryOfResidence }),
        },
      });
    }

    // Upsert notification settings
    const settings = await this.prisma.notificationSettings.upsert({
      where: { userId },
      create: {
        userId,
        emailAlerts: emailAlerts ?? true,
        comparisonNotifications: comparisonNotifications ?? false,
        marketingEmails: marketingEmails ?? false,
      },
      update: {
        ...(emailAlerts !== undefined && { emailAlerts }),
        ...(comparisonNotifications !== undefined && { comparisonNotifications }),
        ...(marketingEmails !== undefined && { marketingEmails }),
      },
    });

    return settings;
  }
}
