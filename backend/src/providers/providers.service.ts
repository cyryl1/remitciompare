import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import { Provider } from '@prisma/client';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  private mapToFrontendProvider(provider: Provider) {
    return {
      id: provider.id,
      slug: provider.slug,
      name: provider.name,
      logo: provider.logoUrl,
      tagline: provider.tagline,
      description: provider.description,
      rating: provider.trustpilotRating || 0,
      reviewCount: provider.trustpilotCount || 0,
      supportedCurrencies: [], // Or calculate from routes
      deliveryMethods: provider.deliveryMethods || [],
      countries: [], // Or calculate from routes
      features: provider.features || [],
      pros: [],
      cons: [],
      affiliateUrl: provider.affiliateUrl,
      isActive: provider.isActive,
      isFeatured: provider.status === 'INTEGRATED',
    };
  }

  async findAll(page: number = 1, limit: number = 20, search?: string, sendCurrency?: string, receiveCurrency?: string) {
    const skip = (page - 1) * limit;
    
    let where: any = { isActive: true, status: 'INTEGRATED' as const };
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' as const };
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

  async findOne(slug: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { slug },
      include: { routes: true },
    });
    
    if (!provider) {
      throw new NotFoundException(`Provider with slug '${slug}' not found`);
    }
    
    return this.mapToFrontendProvider(provider);
  }

  async create(createProviderDto: CreateProviderDto) {
    return this.prisma.provider.create({
      data: createProviderDto,
    });
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    try {
      return await this.prisma.provider.update({
        where: { id },
        data: updateProviderDto,
      });
    } catch (error) {
      throw new NotFoundException(`Provider with ID '${id}' not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.provider.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Provider with ID '${id}' not found`);
    }
  }

  async addRoute(providerId: string, createRouteDto: CreateRouteDto) {
    // Verify provider exists
    await this.prisma.provider.findUniqueOrThrow({ where: { id: providerId } }).catch(() => {
      throw new NotFoundException(`Provider with ID '${providerId}' not found`);
    });

    return this.prisma.providerRoute.create({
      data: {
        providerId,
        ...createRouteDto,
      },
    });
  }
}
