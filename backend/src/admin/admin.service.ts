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
      activeProviders
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

    const data = providers.map(p => ({
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
        status: data.isFeatured ? 'INTEGRATED' : 'UNAVAILABLE'
      }
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
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as any } },
        { fullName: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = users.map(u => {
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
}
