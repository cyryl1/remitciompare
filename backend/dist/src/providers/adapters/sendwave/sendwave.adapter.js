"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SendwaveAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendwaveAdapter = void 0;
const common_1 = require("@nestjs/common");
let SendwaveAdapter = SendwaveAdapter_1 = class SendwaveAdapter {
    name = 'Sendwave';
    logger = new common_1.Logger(SendwaveAdapter_1.name);
    async getQuote(request) {
        this.logger.debug(`[MOCK] Fetching Sendwave quote...`);
        await new Promise((r) => setTimeout(r, 60 + Math.random() * 90));
        const baseRate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
        const rate = baseRate * 0.98;
        const totalFees = 0;
        const recipientAmount = request.sendAmount * rate;
        return {
            provider: this.name,
            sendAmount: request.sendAmount,
            sourceCurrency: request.sourceCurrency,
            targetCurrency: request.targetCurrency,
            exchangeRate: parseFloat(rate.toFixed(2)),
            grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
            fees: { fixed: 0, percentage: 0, tax: 0, discount: 0, other: 0 },
            totalFees,
            recipientAmount: parseFloat(recipientAmount.toFixed(2)),
            deliveryEstimate: 'Instant',
            paymentMethod: 'MOBILE_MONEY',
            quoteTimestamp: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            status: 'SUCCESS',
        };
    }
    getMockRate(from, to) {
        const rates = {
            'GBP-NGN': 2075,
            'USD-NGN': 1615,
            'EUR-NGN': 1740,
            'CAD-NGN': 1185,
        };
        return rates[`${from}-${to}`] ?? 1600;
    }
};
exports.SendwaveAdapter = SendwaveAdapter;
exports.SendwaveAdapter = SendwaveAdapter = SendwaveAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], SendwaveAdapter);
//# sourceMappingURL=sendwave.adapter.js.map