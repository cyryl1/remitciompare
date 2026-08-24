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
let RatesController = class RatesController {
    comparisonService;
    constructor(comparisonService) {
        this.comparisonService = comparisonService;
    }
    async getSnapshots(source = 'GBP', target = 'NGN', hours = '24') {
        const hoursNum = parseInt(hours, 10) || 24;
        return this.comparisonService.getSnapshots(source.toUpperCase(), target.toUpperCase(), hoursNum);
    }
};
exports.RatesController = RatesController;
__decorate([
    (0, common_1.Get)('snapshots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get historical rate snapshots for a specific route' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rate snapshots' }),
    __param(0, (0, common_1.Query)('source')),
    __param(1, (0, common_1.Query)('target')),
    __param(2, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getSnapshots", null);
exports.RatesController = RatesController = __decorate([
    (0, swagger_1.ApiTags)('rates'),
    (0, common_1.Controller)('api/rates'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService])
], RatesController);
//# sourceMappingURL=rates.controller.js.map