"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RiaAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiaAdapter = void 0;
const common_1 = require("@nestjs/common");
let RiaAdapter = RiaAdapter_1 = class RiaAdapter {
    name = 'Ria';
    logger = new common_1.Logger(RiaAdapter_1.name);
    async getQuote(request) {
        this.logger.debug(`[MOCK] Fetching Ria quote...`);
        await new Promise((r) => setTimeout(r, 45 + Math.random() * 60));
        const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
        const rate = baseRate * (1 - Math.random() * 0.015);
        const totalFees = 3.00;
        const recipientAmount = (request.sendAmount - totalFees) * rate;
        return {
            provider: this.name,
            sendAmount: request.sendAmount,
            sourceCurrency: request.sourceCurrency,
            targetCurrency: request.targetCurrency,
            exchangeRate: parseFloat(rate.toFixed(2)),
            grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
            fees: { fixed: totalFees, percentage: 0, tax: 0, discount: 0, other: 0 },
            totalFees,
            recipientAmount: parseFloat(recipientAmount.toFixed(2)),
            deliveryEstimate: '15 Minutes',
            paymentMethod: 'CASH_PICKUP',
            quoteTimestamp: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            status: 'SUCCESS',
        };
    }
    getMockRate(from, to) {
        const rates = {
            'GBP-NGN': 2050, 'USD-NGN': 1600, 'EUR-NGN': 1730, 'CAD-NGN': 1180,
        };
        return rates[`${from}-${to}`] ?? 1590;
    }
};
exports.RiaAdapter = RiaAdapter;
exports.RiaAdapter = RiaAdapter = RiaAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], RiaAdapter);
//# sourceMappingURL=ria.adapter.js.map