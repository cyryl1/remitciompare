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
const create_comparison_dto_1 = require("./dto/create-comparison.dto");
const optional_jwt_guard_1 = require("../auth/guards/optional-jwt.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const uuid_1 = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
let ComparisonController = class ComparisonController {
    comparisonService;
    prisma;
    constructor(comparisonService, prisma) {
        this.comparisonService = comparisonService;
        this.prisma = prisma;
    }
    async getComparison(dto, req, res) {
        const user = req.user;
        let anonymousSessionId = req.cookies?.anonymous_session;
        if (!user && !anonymousSessionId) {
            anonymousSessionId = (0, uuid_1.v4)();
            res.cookie('anonymous_session', anonymousSessionId, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
        }
        return this.comparisonService.compare(dto, user?.id, anonymousSessionId);
    }
    async getHistory(req) {
        const user = req.user;
        return this.prisma.comparison.findMany({
            where: { userId: user.id },
            include: {
                quotes: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
};
exports.ComparisonController = ComparisonController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get live comparison quotes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparison results' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comparison_dto_1.CreateComparisonDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "getComparison", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get comparison history for logged in user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComparisonController.prototype, "getHistory", null);
exports.ComparisonController = ComparisonController = __decorate([
    (0, swagger_1.ApiTags)('comparison'),
    (0, common_1.Controller)('api/comparison'),
    __metadata("design:paramtypes", [comparison_service_1.ComparisonService,
        prisma_service_1.PrismaService])
], ComparisonController);
//# sourceMappingURL=comparison.controller.js.map