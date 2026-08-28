"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RevolutAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevolutAdapter = void 0;
const common_1 = require("@nestjs/common");
let RevolutAdapter = RevolutAdapter_1 = class RevolutAdapter {
    name = 'Revolut';
    logger = new common_1.Logger(RevolutAdapter_1.name);
    async getQuote(request) {
        this.logger.debug(`[MOCK] Fetching Revolut quote for ${request.sendAmount}`);
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 80));
        const rate = this.getMockRate(request.sourceCurrency, request.targetCurrency);
        const fixedFee = 0;
        const percentageFee = request.sendAmount * 0.005;
        const totalFees = fixedFee + percentageFee;
        const recipientAmount = (request.sendAmount - totalFees) * rate;
        return {
            provider: this.name,
            sendAmount: request.sendAmount,
            sourceCurrency: request.sourceCurrency,
            targetCurrency: request.targetCurrency,
            exchangeRate: parseFloat(rate.toFixed(2)),
            grossRecipientAmount: parseFloat((request.sendAmount * rate).toFixed(2)),
            fees: { fixed: fixedFee, percentage: parseFloat(percentageFee.toFixed(2)), tax: 0, discount: 0, other: 0 },
            totalFees: parseFloat(totalFees.toFixed(2)),
            recipientAmount: parseFloat(recipientAmount.toFixed(2)),
            deliveryEstimate: 'Instant',
            paymentMethod: 'BANK_TRANSFER',
            quoteTimestamp: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            status: 'SUCCESS',
        };
    }
    getMockRate(from, to) {
        const rates = {
            'GBP-NGN': 2085, 'USD-NGN': 1625, 'EUR-NGN': 1755, 'CAD-NGN': 1195,
        };
        return rates[`${from}-${to}`] ?? 1600;
    }
};
exports.RevolutAdapter = RevolutAdapter;
exports.RevolutAdapter = RevolutAdapter = RevolutAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], RevolutAdapter);
//# sourceMappingURL=revolut.adapter.js.map