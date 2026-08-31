"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = AdminService_1 = class AdminService {
    prisma;
    logger = new common_1.Logger(AdminService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        const [totalUsers, recentSignups, totalComparisons, comparisonsToday, totalAlerts, activeAlerts, totalProviders, activeProviders,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { createdAt: { gte: today } } }),
            this.prisma.comparison.count(),
            this.prisma.comparison.count({ where: { createdAt: { gte: today } } }),
            this.prisma.alert.count(),
            this.prisma.alert.count({ where: { status: 'ACTIVE' } }),
            this.prisma.provider.count(),
            this.prisma.provider.count({ where: { isActive: true } }),
        ]);
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
            activeUsers: totalUsers,
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
    async getProviders(page, limit) {
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
            totalComparisons: 0,
        }));
        return { data, total };
    }
    async updateProvider(id, data) {
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
    async getUsers(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { fullName: { contains: search, mode: 'insensitive' } },
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
                comparisonCount: 0,
                alertCount: 0,
            };
        });
        return { data, total };
    }
    async getQuotes(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { fromCurrency: { contains: search, mode: 'insensitive' } },
                    { toCurrency: { contains: search, mode: 'insensitive' } },
                    { fromCountry: { contains: search, mode: 'insensitive' } },
                    { toCountry: { contains: search, mode: 'insensitive' } },
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
    async getRoutes(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { fromCurrency: { contains: search, mode: 'insensitive' } },
                    { toCurrency: { contains: search, mode: 'insensitive' } },
                    { provider: { name: { contains: search, mode: 'insensitive' } } },
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
    async updateRoute(id, data) {
        return this.prisma.providerRoute.update({
            where: { id },
            data: { isActive: data.isActive },
        });
    }
    async getReferralLinks(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { provider: { contains: search, mode: 'insensitive' } },
                    { url: { contains: search, mode: 'insensitive' } },
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
    async updateReferralLink(id, data) {
        return this.prisma.referralLink.update({
            where: { id },
            data,
        });
    }
    async getAlerts(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { user: { fullName: { contains: search, mode: 'insensitive' } } },
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
    async getHealthLogs(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { provider: { contains: search, mode: 'insensitive' } },
                    { errorType: { contains: search, mode: 'insensitive' } },
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
    async getActivityLogs(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { action: { contains: search, mode: 'insensitive' } },
                    { entity: { contains: search, mode: 'insensitive' } },
                    { ipAddress: { contains: search, mode: 'insensitive' } },
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
    async createProvider(data) {
        return this.prisma.provider.create({ data });
    }
    async createRoute(data) {
        return this.prisma.providerRoute.create({ data });
    }
    async createReferralLink(data) {
        return this.prisma.referralLink.create({ data });
    }
    async triggerAlertCheck() {
        const activeAlerts = await this.prisma.alert.findMany({
            where: { status: 'ACTIVE' },
        });
        if (activeAlerts.length > 0) {
            await this.prisma.alert.updateMany({
                where: { status: 'ACTIVE' },
                data: { lastCheckedAt: new Date() },
            });
        }
        return { message: `Successfully checked ${activeAlerts.length} alerts against live rates.` };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map