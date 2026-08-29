import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { auth } from '../lib/firebase-admin';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

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
    const {
      emailAlerts,
      comparisonNotifications,
      marketingEmails,
      defaultRoute,
      countryOfResidence,
      fullName,
    } = data;

    // Update top-level user fields if provided
    if (
      defaultRoute !== undefined ||
      countryOfResidence !== undefined ||
      fullName !== undefined
    ) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(defaultRoute !== undefined && { defaultRoute }),
          ...(countryOfResidence !== undefined && { countryOfResidence }),
          ...(fullName !== undefined && { fullName }),
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
        ...(comparisonNotifications !== undefined && {
          comparisonNotifications,
        }),
        ...(marketingEmails !== undefined && { marketingEmails }),
      },
    });

    return settings;
  }

  // --- Saved Routes ---

  async getSavedRoutes(userId: string) {
    return this.prisma.savedRoute.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSavedRoute(
    userId: string,
    data: {
      fromCurrency: string;
      toCurrency: string;
      fromCountry: string;
      toCountry: string;
      label?: string;
    },
  ) {
    // Check if route already exists for user
    const existing = await this.prisma.savedRoute.findFirst({
      where: {
        userId,
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
      },
    });

    if (existing) {
      return existing; // Already saved
    }

    return this.prisma.savedRoute.create({
      data: {
        userId,
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        fromCountry: data.fromCountry,
        toCountry: data.toCountry,
        label: data.label,
      },
    });
  }

  async removeSavedRoute(userId: string, routeId: string) {
    return this.prisma.savedRoute.deleteMany({
      where: {
        id: routeId,
        userId,
      },
    });
  }

  // --- Account Deletion ---

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Delete from Firebase
    if (user.email) {
      try {
        const firebaseUser = await auth.getUserByEmail(user.email);
        if (firebaseUser) {
          await auth.deleteUser(firebaseUser.uid);
        }
      } catch (err: any) {
        // If user is not found in Firebase, it throws 'auth/user-not-found'. We can ignore it.
        if (err.code !== 'auth/user-not-found') {
          console.error('Error deleting user from Firebase:', err);
        }
      }
    }

    // Prisma cascading deletes should handle related records if configured properly.
    // Assuming schema handles cascade deletes, we just delete the user.
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // --- Data Archive ---

  async requestDataArchive(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        notificationSettings: true,
        savedRoutes: true,
        alerts: true,
        comparisons: {
          take: 50,
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!user) throw new NotFoundException('User not found');

    // Create a safe payload without sensitive data
    const safeData = {
      profile: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        countryOfResidence: user.countryOfResidence,
        defaultRoute: user.defaultRoute,
        createdAt: user.createdAt,
      },
      preferences: user.notificationSettings,
      savedRoutes: user.savedRoutes,
      alerts: user.alerts,
      recentComparisons: user.comparisons,
    };

    if (user.email) {
      await this.emailService.sendDataArchiveEmail(user.email, safeData);
    }
    
    return { success: true, message: 'Data archive requested' };
  }
}
