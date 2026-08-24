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
var ComparisonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonService = exports.Priority = void 0;
const common_1 = require("@nestjs/common");
const providers_module_1 = require("../providers/providers.module");
var Priority;
(function (Priority) {
    Priority["MOST_RECEIVED"] = "MOST_RECEIVED";
    Priority["FASTEST"] = "FASTEST";
    Priority["LOWEST_COST"] = "LOWEST_COST";
})(Priority || (exports.Priority = Priority = {}));
let ComparisonService = ComparisonService_1 = class ComparisonService {
    adapters;
    logger = new common_1.Logger(ComparisonService_1.name);
    TIMEOUT_MS = 5000;
    constructor(adapters) {
        this.adapters = adapters;
    }
    async compare(request, priority) {
        this.logger.debug(`Starting comparison for ${request.sendAmount} ${request.sourceCurrency}->${request.targetCurrency}. Priority: ${priority}`);
        const promises = this.adapters.map(adapter => this.executeWithTimeout(adapter.getQuote(request), this.TIMEOUT_MS)
            .catch(err => {
            this.logger.error(`Adapter ${adapter.name} failed or timed out: ${err.message}`);
            return this.buildFailedQuote(adapter.name, request, 'TIMEOUT');
        }));
        const results = await Promise.all(promises);
        const successfulQuotes = results.filter(q => q.status === 'SUCCESS');
        successfulQuotes.sort((a, b) => this.rankQuotes(a, b, priority));
        const recommended = successfulQuotes.length > 0 ? successfulQuotes[0] : null;
        let moneyLeftOnTable = 0;
        if (successfulQuotes.length > 1) {
            const sortedByRecipient = [...successfulQuotes].sort((a, b) => b.recipientAmount - a.recipientAmount);
            moneyLeftOnTable = sortedByRecipient[0].recipientAmount - sortedByRecipient[1].recipientAmount;
        }
        return {
            recommended,
            allQuotes: results,
            moneyLeftOnTable
        };
    }
    rankQuotes(a, b, priority) {
        if (priority === Priority.MOST_RECEIVED) {
            return b.recipientAmount - a.recipientAmount;
        }
        else if (priority === Priority.LOWEST_COST) {
            return a.totalFees - b.totalFees;
        }
        else if (priority === Priority.FASTEST) {
            return b.recipientAmount - a.recipientAmount;
        }
        return 0;
    }
    executeWithTimeout(promise, timeoutMs) {
        let timeoutHandle;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error(`Quote timeout exceeded ${timeoutMs}ms`)), timeoutMs);
        });
        return Promise.race([
            promise,
            timeoutPromise
        ]).finally(() => clearTimeout(timeoutHandle));
    }
    buildFailedQuote(providerName, request, status) {
        return {
            provider: providerName,
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
            status
        };
    }
};
exports.ComparisonService = ComparisonService;
exports.ComparisonService = ComparisonService = ComparisonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_module_1.PROVIDER_ADAPTERS)),
    __metadata("design:paramtypes", [Array])
], ComparisonService);
//# sourceMappingURL=comparison.service.js.map