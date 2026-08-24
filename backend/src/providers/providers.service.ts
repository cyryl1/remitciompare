import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive: boolean = false) {
    return this.prisma.provider.findMany({
      where: includeInactive ? undefined : { isActive: true, status: 'INTEGRATED' },
      include: {
        routes: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { slug },
      include: { routes: true },
    });
    
    if (!provider) {
      throw new NotFoundException(`Provider with slug '${slug}' not found`);
    }
    
    return provider;
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
