"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WorldRemitAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldRemitAdapter = void 0;
const common_1 = require("@nestjs/common");
let WorldRemitAdapter = WorldRemitAdapter_1 = class WorldRemitAdapter {
    name = 'WorldRemit';
    logger = new common_1.Logger(WorldRemitAdapter_1.name);
    async getQuote(request) {
        this.logger.debug(`[MOCK] Fetching WorldRemit quote for ${request.sendAmount} ${request.sourceCurrency} → ${request.targetCurrency}`);
        await new Promise((r) => setTimeout(r, 60 + Math.random() * 100));
        const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
        const rate = baseRate * (1 + (Math.random() - 0.5) * 0.02);
        const fixedFee = 3.99;
        const totalFees = fixedFee;
        const recipientAmount = (request.sendAmount - totalFees) * rate;
        const quote = {
            provider: this.name,
            sendAmount: request.sendAmount,
            sourceCurrency: request.sourceCurrency,
            targetCurrency: request.targetCurrency,
            exchangeRate: parseFloat(rate.toFixed(2)),
            grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
            fees: {
                fixed: fixedFee,
                percentage: 0,
                tax: 0,
                discount: 0,
                other: 0,
            },
            totalFees,
            recipientAmount: parseFloat(recipientAmount.toFixed(2)),
            deliveryEstimate: 'Within 2 Hours',
            paymentMethod: 'BANK_TRANSFER',
            quoteTimestamp: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            status: 'SUCCESS',
        };
        return quote;
    }
    getMockRate(from, to) {
        const rates = {
            'GBP-NGN': 2040,
            'USD-NGN': 1595,
            'EUR-NGN': 1710,
            'CAD-NGN': 1160,
        };
        return rates[`${from}-${to}`] ?? 1570;
    }
};
exports.WorldRemitAdapter = WorldRemitAdapter;
exports.WorldRemitAdapter = WorldRemitAdapter = WorldRemitAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], WorldRemitAdapter);
//# sourceMappingURL=worldremit.adapter.js.map