"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WiseAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WiseAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let WiseAdapter = WiseAdapter_1 = class WiseAdapter {
    name = 'Wise';
    logger = new common_1.Logger(WiseAdapter_1.name);
    apiUrl = 'https://api.transferwise.com/v3/quotes';
    async getQuote(request) {
        try {
            this.logger.debug(`Fetching Wise quote for ${request.sendAmount} ${request.sourceCurrency} to ${request.targetCurrency}`);
            const response = await axios_1.default.post(this.apiUrl, {
                sourceCurrency: request.sourceCurrency,
                targetCurrency: request.targetCurrency,
                sourceAmount: request.sendAmount,
                payOut: 'BANK_TRANSFER',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
                },
                timeout: 4000,
            });
            const data = response.data;
            const paymentOption = data.paymentOptions.find((opt) => opt.payIn === 'BANK_TRANSFER' && opt.payOut === 'BANK_TRANSFER') || data.paymentOptions[0];
            if (!paymentOption) {
                throw new Error('No valid payment options returned from Wise.');
            }
            const quote = {
                provider: this.name,
                sendAmount: request.sendAmount,
                sourceCurrency: request.sourceCurrency,
                targetCurrency: request.targetCurrency,
                exchangeRate: data.rate,
                grossRecipientAmount: paymentOption.targetAmount + paymentOption.fee.total,
                fees: {
                    fixed: paymentOption.fee.transferwise,
                    percentage: 0,
                    tax: 0,
                    discount: paymentOption.fee.discount || 0,
                    other: 0,
                },
                totalFees: paymentOption.fee.total,
                recipientAmount: paymentOption.targetAmount,
                deliveryEstimate: paymentOption.estimatedDeliveryTime || 'Fast',
                paymentMethod: paymentOption.payIn,
                quoteTimestamp: new Date(),
                expiresAt: new Date(data.expirationTime),
                status: 'SUCCESS',
            };
            return quote;
        }
        catch (error) {
            this.logger.error(`Failed to fetch quote from Wise: ${error.message}`);
            return {
                provider: this.name,
                sendAmount: request.sendAmount,
                sourceCurrency: request.sourceCurrency,
                targetCurrency: request.targetCurrency,
                exchangeRate: 0,
                grossRecipientAmount: 0,
                fees: { fixed: 0, percentage: 0, tax: 0, discount: 0, other: 0 },
                totalFees: 0,
                recipientAmount: 0,
                deliveryEstimate: '',
                paymentMethod: '',
                quoteTimestamp: new Date(),
                expiresAt: null,
                status: 'FAILED',
            };
        }
    }
};
exports.WiseAdapter = WiseAdapter;
exports.WiseAdapter = WiseAdapter = WiseAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], WiseAdapter);
//# sourceMappingURL=wise.adapter.js.map