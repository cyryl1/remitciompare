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
let UsersService = UsersService_1 = class UsersService {
    prisma;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
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
        const { emailAlerts, comparisonNotifications, marketingEmails, defaultRoute, countryOfResidence } = data;
        if (defaultRoute !== undefined || countryOfResidence !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(defaultRoute !== undefined && { defaultRoute }),
                    ...(countryOfResidence !== undefined && { countryOfResidence }),
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
                ...(comparisonNotifications !== undefined && { comparisonNotifications }),
                ...(marketingEmails !== undefined && { marketingEmails }),
            },
        });
        return settings;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map