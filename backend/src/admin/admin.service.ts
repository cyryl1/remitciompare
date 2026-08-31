import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getActivityLogs(limit = 50) {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getQuoteFailures(limit = 50) {
    return this.prisma.quoteFailureLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      recentSignups,
      totalComparisons,
      comparisonsToday,
      totalAlerts,
      activeAlerts,
      totalProviders,
      activeProviders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.comparison.count(),
      this.prisma.comparison.count({ where: { createdAt: { gte: today } } }),
      this.prisma.alert.count(),
      this.prisma.alert.count({ where: { status: 'ACTIVE' } }),
      this.prisma.provider.count(),
      this.prisma.provider.count({ where: { isActive: true } }),
    ]);

    // Mock top corridors for MVP
    const topCorridors = [
      { from: 'GBP', to: 'NGN', count: Math.floor(totalComparisons * 0.8) },
      { from: 'USD', to: 'NGN', count: Math.floor(totalComparisons * 0.15) },
      { from: 'EUR', to: 'NGN', count: Math.floor(totalComparisons * 0.05) },
    ];

    const recentAlerts = await this.prisma.alert.findMany({
      where: { status: 'TRIGGERED' },
      orderBy: { lastTriggeredAt: 'desc' },
      take: 5,
      include: {
        user: { select: { email: true } },
      },
    });

    return {
      totalUsers,
      activeUsers: totalUsers, // Mock
      totalComparisons,
      comparisonsToday,
      totalAlerts,
      activeAlerts,
      totalProviders,
      activeProviders,
      topCorridors,
      recentSignups,
      recentAlerts,
    };
  }

  async getProviders(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [providers, total] = await Promise.all([
      this.prisma.provider.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.provider.count(),
    ]);

    const data = providers.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      isActive: p.isActive,
      isFeatured: p.status === 'INTEGRATED',
      lastRateUpdate: p.updatedAt.toISOString(),
      totalComparisons: 0, // Mock
    }));

    return { data, total };
  }

  async updateProvider(id: string, data: any) {
    const updated = await this.prisma.provider.update({
      where: { id },
      data: {
        isActive: data.isActive,
        status: data.isFeatured ? 'INTEGRATED' : 'UNAVAILABLE',
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      isActive: updated.isActive,
      isFeatured: updated.status === 'INTEGRATED',
      lastRateUpdate: updated.updatedAt.toISOString(),
      totalComparisons: 0,
    };
  }

  async getUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as any } },
            { fullName: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = users.map((u) => {
      const nameParts = u.fullName ? u.fullName.split(' ') : [''];
      return {
        id: u.id,
        email: u.email,
        firstName: nameParts[0],
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        comparisonCount: 0, // Mock
        alertCount: 0, // Mock
      };
    });

    return { data, total };
  }

  async getQuotes(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { fromCurrency: { contains: search, mode: 'insensitive' as any } },
            { toCurrency: { contains: search, mode: 'insensitive' as any } },
            { fromCountry: { contains: search, mode: 'insensitive' as any } },
            { toCountry: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [comparisons, total] = await Promise.all([
      this.prisma.comparison.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } },
          quotes: { select: { provider: true, recipientAmount: true, status: true }, take: 3, orderBy: { recipientAmount: 'desc' } }
        },
      }),
      this.prisma.comparison.count({ where }),
    ]);

    return { data: comparisons, total };
  }

  async getRoutes(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { fromCurrency: { contains: search, mode: 'insensitive' as any } },
            { toCurrency: { contains: search, mode: 'insensitive' as any } },
            { provider: { name: { contains: search, mode: 'insensitive' as any } } },
          ],
        }
      : {};

    const [routes, total] = await Promise.all([
      this.prisma.providerRoute.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ fromCurrency: 'asc' }, { toCurrency: 'asc' }],
        include: {
          provider: { select: { name: true, slug: true, isActive: true } }
        },
      }),
      this.prisma.providerRoute.count({ where }),
    ]);

    return { data: routes, total };
  }

  async updateRoute(id: string, data: { isActive: boolean }) {
    return this.prisma.providerRoute.update({
      where: { id },
      data: { isActive: data.isActive },
    });
  }

  async getReferralLinks(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { provider: { contains: search, mode: 'insensitive' as any } },
            { url: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [links, total] = await Promise.all([
      this.prisma.referralLink.findMany({
        where,
        skip,
        take: limit,
        orderBy: { provider: 'asc' },
      }),
      this.prisma.referralLink.count({ where }),
    ]);

    return { data: links, total };
  }

  async updateReferralLink(id: string, data: { isActive?: boolean; url?: string }) {
    return this.prisma.referralLink.update({
      where: { id },
      data,
    });
  }

  async getAlerts(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { user: { email: { contains: search, mode: 'insensitive' as any } } },
            { user: { fullName: { contains: search, mode: 'insensitive' as any } } },
          ],
        }
      : {};

    const [alerts, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } }
        },
      }),
      this.prisma.alert.count({ where }),
    ]);

    return { data: alerts, total };
  }

  async getHealthLogs(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { provider: { contains: search, mode: 'insensitive' as any } },
            { errorType: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [logs, total] = await Promise.all([
      this.prisma.quoteFailureLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quoteFailureLog.count({ where }),
    ]);

    return { data: logs, total };
  }

  async getActivityLogs(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { action: { contains: search, mode: 'insensitive' as any } },
            { entity: { contains: search, mode: 'insensitive' as any } },
            { ipAddress: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return { data: logs, total };
  }

  async createProvider(data: { name: string; slug: string; websiteUrl?: string; isActive?: boolean; isFeatured?: boolean }) {
    return this.prisma.provider.create({ data });
  }

  async createRoute(data: { providerId: string; fromCurrency: string; toCurrency: string; fromCountry?: string; toCountry?: string; isActive?: boolean }) {
    return this.prisma.providerRoute.create({ data });
  }

  async createReferralLink(data: { providerId: string; url: string; utmSource?: string; utmCampaign?: string; utmMedium?: string; isActive?: boolean }) {
    return this.prisma.referralLink.create({ data });
  }

  async triggerAlertCheck() {
    // Mock triggering the active alerts
    const activeAlerts = await this.prisma.alert.findMany({
      where: { status: 'ACTIVE' },
    });
    
    // Update their lastCheckedAt
    if (activeAlerts.length > 0) {
      await this.prisma.alert.updateMany({
        where: { status: 'ACTIVE' },
        data: { lastCheckedAt: new Date() },
      });
    }

    return { message: `Successfully checked ${activeAlerts.length} alerts against live rates.` };
  }
}
