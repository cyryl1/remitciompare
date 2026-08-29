import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('providers')
@Controller('api/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all active providers (public) or all providers (admin)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sendCurrency', required: false, type: String })
  @ApiQuery({ name: 'receiveCurrency', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of providers' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sendCurrency') sendCurrency?: string,
    @Query('receiveCurrency') receiveCurrency?: string,
  ) {
    return this.providersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
      sendCurrency,
      receiveCurrency,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured providers' })
  @ApiResponse({ status: 200, description: 'List of featured providers' })
  findFeatured() {
    return this.providersService.findFeatured();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get provider details by slug' })
  @ApiResponse({ status: 200, description: 'Provider details' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  findOne(@Param('slug') slug: string) {
    return this.providersService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new provider (Admin only)' })
  @ApiResponse({ status: 201, description: 'Provider created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a provider (Admin only)' })
  @ApiResponse({ status: 200, description: 'Provider updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a provider (Admin only)' })
  @ApiResponse({ status: 200, description: 'Provider deleted successfully' })
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }

  @Post(':id/routes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a supported route to a provider (Admin only)' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  addRoute(@Param('id') id: string, @Body() createRouteDto: CreateRouteDto) {
    return this.providersService.addRoute(id, createRouteDto);
  }
}
