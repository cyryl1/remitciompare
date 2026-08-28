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
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToFrontendProvider(provider) {
        return {
            id: provider.id,
            slug: provider.slug,
            name: provider.name,
            logo: provider.logoUrl,
            tagline: provider.tagline,
            description: provider.description,
            rating: provider.trustpilotRating || 0,
            reviewCount: provider.trustpilotCount || 0,
            supportedCurrencies: [],
            deliveryMethods: provider.deliveryMethods || [],
            countries: [],
            features: provider.features || [],
            pros: [],
            cons: [],
            affiliateUrl: provider.affiliateUrl,
            isActive: provider.isActive,
            isFeatured: provider.status === 'INTEGRATED',
        };
    }
    async findAll(page = 1, limit = 20, search, sendCurrency, receiveCurrency) {
        const skip = (page - 1) * limit;
        let where = { isActive: true, status: 'INTEGRATED' };
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (sendCurrency || receiveCurrency) {
            where.routes = {
                some: {
                    ...(sendCurrency && { fromCurrency: sendCurrency }),
                    ...(receiveCurrency && { toCurrency: receiveCurrency }),
                    isActive: true
                }
            };
        }
        const [providers, total] = await Promise.all([
            this.prisma.provider.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.provider.count({ where }),
        ]);
        return {
            data: providers.map(this.mapToFrontendProvider),
            total,
            page,
            limit,
        };
    }
    async findFeatured() {
        const providers = await this.prisma.provider.findMany({
            where: { isActive: true, status: 'INTEGRATED' },
            take: 5,
        });
        return providers.map(this.mapToFrontendProvider);
    }
    async findOne(slug) {
        const provider = await this.prisma.provider.findUnique({
            where: { slug },
            include: { routes: true },
        });
        if (!provider) {
            throw new common_1.NotFoundException(`Provider with slug '${slug}' not found`);
        }
        return this.mapToFrontendProvider(provider);
    }
    async create(createProviderDto) {
        return this.prisma.provider.create({
            data: createProviderDto,
        });
    }
    async update(id, updateProviderDto) {
        try {
            return await this.prisma.provider.update({
                where: { id },
                data: updateProviderDto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Provider with ID '${id}' not found`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.provider.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Provider with ID '${id}' not found`);
        }
    }
    async addRoute(providerId, createRouteDto) {
        await this.prisma.provider.findUniqueOrThrow({ where: { id: providerId } }).catch(() => {
            throw new common_1.NotFoundException(`Provider with ID '${providerId}' not found`);
        });
        return this.prisma.providerRoute.create({
            data: {
                providerId,
                ...createRouteDto,
            },
        });
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map