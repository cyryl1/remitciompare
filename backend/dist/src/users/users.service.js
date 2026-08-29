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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const firebase_admin_1 = require("../lib/firebase-admin");
const email_service_1 = require("../email/email.service");
let UsersService = UsersService_1 = class UsersService {
    prisma;
    emailService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async getPreferences(userId) {
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
    async updatePreferences(userId, data) {
        const { emailAlerts, comparisonNotifications, marketingEmails, defaultRoute, countryOfResidence, fullName, } = data;
        if (defaultRoute !== undefined ||
            countryOfResidence !== undefined ||
            fullName !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(defaultRoute !== undefined && { defaultRoute }),
                    ...(countryOfResidence !== undefined && { countryOfResidence }),
                    ...(fullName !== undefined && { fullName }),
                },
            });
        }
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
    async getSavedRoutes(userId) {
        return this.prisma.savedRoute.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addSavedRoute(userId, data) {
        const existing = await this.prisma.savedRoute.findFirst({
            where: {
                userId,
                fromCurrency: data.fromCurrency,
                toCurrency: data.toCurrency,
            },
        });
        if (existing) {
            return existing;
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
    async removeSavedRoute(userId, routeId) {
        return this.prisma.savedRoute.deleteMany({
            where: {
                id: routeId,
                userId,
            },
        });
    }
    async deleteAccount(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.email) {
            try {
                const firebaseUser = await firebase_admin_1.auth.getUserByEmail(user.email);
                if (firebaseUser) {
                    await firebase_admin_1.auth.deleteUser(firebaseUser.uid);
                }
            }
            catch (err) {
                if (err.code !== 'auth/user-not-found') {
                    console.error('Error deleting user from Firebase:', err);
                }
            }
        }
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
    async requestDataArchive(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map