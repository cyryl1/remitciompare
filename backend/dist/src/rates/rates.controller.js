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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const comparison_service_1 = require("../comparison/comparison.service");
const create_comparison_dto_1 = require("../comparison/dto/create-comparison.dto");
const prisma_service_1 = require("../prisma/prisma.service");
const currencies_1 = require("../utils/currencies");
let RatesController = class RatesController {
    comparisonService;
    prisma;
    constructor(comparisonService, prisma) {
        this.comparisonService = comparisonService;
        this.prisma = prisma;
    }
    async compare(amount, sendCurrency, receiveCurrency, priority = comparison_service_1.Priority.MOST_RECEIVED, providerSlug) {
        const dto = new create_comparison_dto_1.CreateComparisonDto();
        dto.sendAmount = amount ? parseFloat(amount) : 500;
        dto.sourceCurrency = sendCurrency || 'GBP';
        dto.targetCurrency = receiveCurrency || 'NGN';
        dto.priority = priority;
        dto.providerSlug = providerSlug;
        dto.fromCountry =
            currencies_1.CURRENCY_TO_COUNTRY[dto.sourceCurrency.toUpperCase()]?.toUpperCase() ||
                dto.sourceCurrency.substring(0, 2).toUpperCase();
        dto.toCountry =
            currencies_1.CURRENCY_TO_COUNTRY[dto.targetCurrency.toUpperCase()]?.toUpperCase() ||
                dto.targetCurrency.substring(0, 2).toUpperCase();
        try {
            const result = await this.comparisonService.compare(dto, undefined, undefined, false);
            const providers = await this.prisma.provider.findMany();
            const logoMap = new Map();
            const urlMap = new Map();
            const slugMap = new Map();
            providers.forEach((p) => {
                let logo = p.logoUrl;
                try {
                    if (p.websiteUrl) {
                        const domain = new URL(p.websiteUrl).hostname;
                        logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                    }
                }
                catch (e) {
                }
                logoMap.set(p.name.toLowerCase(), logo);
                slugMap.set(p.name.toLowerCase(), p.slug);
            });
            const successfulQuotes = result.allQuotes.filter(q => q.status === 'SUCCESS');
            let bestRateProvider = null;
            if (successfulQuotes.length > 0) {
                bestRateProvider = [...successfulQuotes].sort((a, b) => b.recipientAmount - a.recipientAmount)[0].provider;
            }
            return result.allQuotes.map((q) => {
                const slug = q.provider.toLowerCase().replace(/\s+/g, '');
                const badges = [];
                if (result.recommended?.provider === q.provider) {
                    badges.push('recommended');
                }
                if (q.provider === bestRateProvider) {
                    badges.push('best_rate');
                }
                return {
                    providerId: slug,
                    providerName: q.provider,
                    providerSlug: slug,
                    providerLogo: logoMap.get(q.provider.toLowerCase()),
                    handoffUrl: `/api/rates/referral/${slugMap.get(q.provider.toLowerCase()) || slug}`,
                    exchangeRate: q.exchangeRate,
                    fee: q.totalFees,
                    feeType: 'flat',
                    receiveAmount: q.recipientAmount,
                    deliveryTime: q.deliveryEstimate || '1-3 days',
                    deliveryMethods: [q.paymentMethod || 'Bank Transfer'],
                    transferLimit: { min: 10, max: 50000 },
                    updatedAt: q.quoteTimestamp.toISOString(),
                    status: q.status,
                    badges,
                };
            });
        }
        catch (error) {
            console.error('ERROR in rates.controller.compare:', error);
            throw new (require('@nestjs/common').HttpException)(error.message, 500);
        }
    }
    async getHistory(sendCurrency = 'GBP', receiveCurrency = 'NGN', days = '30') {
        const hoursNum = (parseInt(days, 10) || 30) * 24;
        const snapshots = await this.comparisonService.getSnapshots(sendCurrency.toUpperCase(), receiveCurrency.toUpperCase(), hoursNum);
        return snapshots.map((s) => ({
            date: s.createdAt.toISOString(),
            rate: s.exchangeRate,
            provider: s.provider,
        }));
    }
    async getLatest(sendCurrency = 'GBP', receiveCurrency = 'NGN') {
        const snapshots = await this.comparisonService.getSnapshots(sendCurrency.toUpperCase(), receiveCurrency.toUpperCase(), 24);
        if (snapshots.length > 0) {
            const latest = snapshots[snapshots.length - 1];
            return {
                rate: latest.exchangeRate,
                updatedAt: latest.createdAt.toISOString(),
            };
        }
        return {
            rate: 1.0,
            updatedAt: new Date().toISOString(),
        };
    }
    async handleReferralRedirect(slug) {
        const provider = await this.prisma.provider.findUnique({
            where: { slug }
        });
        if (!provider) {
            return { url: '/', statusCode: 302 };
        }
        const referralLink = await this.prisma.referralLink.findFirst({
            where: {
                provider: provider.name,
                isActive: true,
            }
        });
        if (referralLink) {
            await this.prisma.referralLink.update({
                where: { id: referralLink.id },
                data: { clickCount: { increment: 1 } }
            });
            let finalUrl = referralLink.url;
            const urlObj = new URL(finalUrl);
            if (referralLink.utmSource)
                urlObj.searchParams.set('utm_source', referralLink.utmSource);
            if (referralLink.utmCampaign)
                urlObj.searchParams.set('utm_campaign', referralLink.utmCampaign);
            return { url: urlObj.toString(), statusCode: 302 };
        }
        const fallbackUrl = provider.affiliateUrl || provider.websiteUrl || `https://${provider.name.toLowerCase().replace(/\s+/g, '')}.com`;
        return { url: fallbackUrl, statusCode: 302 };
    }
};
exports.RatesController = RatesController;
__decorate([
    (0, common_1.Get)('compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare rates across providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparison rates' }),
    __param(0, (0, common_1.Query)('amount')),
    __param(1, (0, common_1.Query)('sendCurrency')),
    __param(2, (0, common_1.Query)('receiveCurrency')),
    __param(3, (0, common_1.Query)('priority')),
    __param(4, (0, common_1.Query)('providerSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "compare", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get historical rates' }),
    __param(0, (0, common_1.Query)('sendCurrency')),
    __param(1, (0, common_1.Query)('receiveCurrency')),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest rate' }),
    __param(0, (0, common_1.Query)('sendCurrency')),
    __param(1, (0, common_1.Query)('receiveCurrency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('referral/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Redirect to provider via referral link' }),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "handleReferralRedirect", null);
exports.RatesController = RatesController = __decorate([
    (0, swagger_1.ApiTags)('rates'),
    (0, common_1.Controller)('api/rates'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService,
        prisma_service_1.PrismaService])
], RatesController);
//# sourceMappingURL=rates.controller.js.map