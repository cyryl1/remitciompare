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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComparisonDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const comparison_service_1 = require("../comparison.service");
class CreateComparisonDto {
    sourceCurrency;
    targetCurrency;
    fromCountry = 'GB';
    toCountry = 'NG';
    sendAmount;
    priority = comparison_service_1.Priority.MOST_RECEIVED;
    paymentMethod;
    deliveryPreference;
    providerSlug;
}
exports.CreateComparisonDto = CreateComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GBP', description: 'Origin currency code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "sourceCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGN', description: 'Destination currency code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "targetCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'GB', description: 'Origin country code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "fromCountry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'NG',
        description: 'Destination country code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "toCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1000,
        description: 'Amount to send in source currency',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateComparisonDto.prototype, "sendAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: comparison_service_1.Priority, example: comparison_service_1.Priority.MOST_RECEIVED }),
    (0, class_validator_1.IsEnum)(comparison_service_1.Priority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BANK_TRANSFER' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FAST' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "deliveryPreference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'lemfi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComparisonDto.prototype, "providerSlug", void 0);
//# sourceMappingURL=create-comparison.dto.js.map