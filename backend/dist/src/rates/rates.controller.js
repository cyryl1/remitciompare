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
let RatesController = class RatesController {
    comparisonService;
    constructor(comparisonService) {
        this.comparisonService = comparisonService;
    }
    async compare(sendAmount, sendCurrency, receiveCurrency) {
        const dto = new create_comparison_dto_1.CreateComparisonDto();
        dto.sendAmount = parseFloat(sendAmount) || 1000;
        dto.sourceCurrency = sendCurrency || 'GBP';
        dto.targetCurrency = receiveCurrency || 'NGN';
        dto.priority = comparison_service_1.Priority.MOST_RECEIVED;
        dto.fromCountry = 'GB';
        dto.toCountry = 'NG';
        const result = await this.comparisonService.compare(dto, undefined, undefined, false);
        return result.allQuotes.map(q => ({
            providerId: q.provider,
            providerName: q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
            providerSlug: q.provider.toLowerCase(),
            providerLogo: `https://logo.clearbit.com/${q.provider.toLowerCase()}.com`,
            exchangeRate: q.exchangeRate,
            fee: q.totalFees,
            feeType: 'flat',
            receiveAmount: q.recipientAmount,
            deliveryTime: q.deliveryEstimate || '1-3 days',
            deliveryMethods: [q.paymentMethod || 'Bank Transfer'],
            transferLimit: { min: 10, max: 50000 },
            updatedAt: q.quoteTimestamp.toISOString(),
            badge: result.recommended?.provider === q.provider ? 'best_rate' : null
        }));
    }
    async getHistory(sendCurrency = 'GBP', receiveCurrency = 'NGN', days = '30') {
        const hoursNum = (parseInt(days, 10) || 30) * 24;
        const snapshots = await this.comparisonService.getSnapshots(sendCurrency.toUpperCase(), receiveCurrency.toUpperCase(), hoursNum);
        return snapshots.map(s => ({
            date: s.createdAt.toISOString(),
            rate: s.exchangeRate,
            provider: s.provider
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
};
exports.RatesController = RatesController;
__decorate([
    (0, common_1.Get)('compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare rates across providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparison rates' }),
    __param(0, (0, common_1.Query)('sendAmount')),
    __param(1, (0, common_1.Query)('sendCurrency')),
    __param(2, (0, common_1.Query)('receiveCurrency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
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
exports.RatesController = RatesController = __decorate([
    (0, swagger_1.ApiTags)('rates'),
    (0, common_1.Controller)('api/rates'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService])
], RatesController);
//# sourceMappingURL=rates.controller.js.map