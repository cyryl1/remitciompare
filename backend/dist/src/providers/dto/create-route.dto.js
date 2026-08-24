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
exports.CreateRouteDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRouteDto {
    fromCurrency;
    toCurrency;
    fromCountry;
    toCountry;
    isActive;
}
exports.CreateRouteDto = CreateRouteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GBP', description: 'Origin currency code (ISO 4217)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "fromCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGN', description: 'Destination currency code (ISO 4217)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "toCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'GB', description: 'Origin country code (ISO 3166-1 alpha-2)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "fromCountry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'NG', description: 'Destination country code (ISO 3166-1 alpha-2)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "toCountry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRouteDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-route.dto.js.map