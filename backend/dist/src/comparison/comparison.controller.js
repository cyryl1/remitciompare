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
exports.ComparisonController = void 0;
const common_1 = require("@nestjs/common");
const comparison_service_1 = require("./comparison.service");
let ComparisonController = class ComparisonController {
    comparisonService;
    constructor(comparisonService) {
        this.comparisonService = comparisonService;
    }
    async getComparison(amount, source = 'GBP', target = 'NGN', priority = comparison_service_1.Priority.MOST_RECEIVED) {
        const sendAmount = parseFloat(amount);
        if (isNaN(sendAmount) || sendAmount <= 0) {
            throw new common_1.BadRequestException('Valid amount is required.');
        }
        const request = {
            sendAmount,
            sourceCurrency: source.toUpperCase(),
            targetCurrency: target.toUpperCase(),
        };
        return this.comparisonService.compare(request, priority);
    }
};
exports.ComparisonController = ComparisonController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('amount')),
    __param(1, (0, common_1.Query)('source')),
    __param(2, (0, common_1.Query)('target')),
    __param(3, (0, common_1.Query)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "getComparison", null);
exports.ComparisonController = ComparisonController = __decorate([
    (0, common_1.Controller)('api/comparison'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService])
], ComparisonController);
//# sourceMappingURL=comparison.controller.js.map