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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getActivity() {
        return this.adminService.getActivityLogs();
    }
    async getQuoteFailures() {
        return this.adminService.getQuoteFailures();
    }
    async getStats() {
        return this.adminService.getDashboardStats();
    }
    async getProviders(page = '1', limit = '20') {
        return this.adminService.getProviders(parseInt(page, 10), parseInt(limit, 10));
    }
    async updateProvider(id, body) {
        return this.adminService.updateProvider(id, body);
    }
    async getUsers(page = '1', limit = '20', search) {
        return this.adminService.getUsers(parseInt(page, 10), parseInt(limit, 10), search);
    }
    async triggerRateRefresh() {
        return { message: 'Rate refresh triggered successfully' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent user activity' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Get)('quote-failures'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent quote failures' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getQuoteFailures", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard stats (users, providers, comparisons)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('providers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get providers list for admin' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Patch)('providers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider settings' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProvider", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get users list' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('rates/refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger a background refresh of all rates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "triggerRateRefresh", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map