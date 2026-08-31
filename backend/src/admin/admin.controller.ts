import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('activity')
  @ApiOperation({ summary: 'Get recent user activity' })
  async getActivity() {
    return this.adminService.getActivityLogs(1, 50);
  }

  @Get('quote-failures')
  @ApiOperation({ summary: 'Get recent quote failures' })
  async getQuoteFailures() {
    return this.adminService.getQuoteFailures();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get dashboard stats (users, providers, comparisons)',
  })
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get providers list for admin' })
  async getProviders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getProviders(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Patch('providers/:id')
  @ApiOperation({ summary: 'Update provider status' })
  async updateProvider(
    @Param('id') id: string,
    @Body() updateData: { isActive?: boolean; isFeatured?: boolean },
  ) {
    return this.adminService.updateProvider(id, updateData);
  }

  @Post('providers')
  @ApiOperation({ summary: 'Create new provider' })
  async createProvider(@Body() data: { name: string; slug: string; websiteUrl: string; isActive?: boolean; isFeatured?: boolean }) {
    return this.adminService.createProvider(data);
  }

  @Get('quotes')
  @ApiOperation({ summary: 'Get quotes/comparisons list' })
  async getQuotes(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getQuotes(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get provider routes' })
  async getRoutes(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getRoutes(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Patch('routes/:id')
  @ApiOperation({ summary: 'Update route status' })
  async updateRoute(
    @Param('id') id: string,
    @Body() updateData: { isActive: boolean },
  ) {
    return this.adminService.updateRoute(id, { isActive: updateData.isActive });
  }

  @Post('routes')
  @ApiOperation({ summary: 'Create new route' })
  async createRoute(@Body() data: { providerId: string; fromCurrency: string; toCurrency: string; fromCountry?: string; toCountry?: string; isActive?: boolean }) {
    return this.adminService.createRoute(data);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get referral links' })
  async getReferralLinks(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getReferralLinks(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Patch('referrals/:id')
  @ApiOperation({ summary: 'Update referral link status' })
  async updateReferralLink(
    @Param('id') id: string,
    @Body() updateData: { isActive?: boolean; url?: string; utmSource?: string; utmCampaign?: string; utmMedium?: string },
  ) {
    return this.adminService.updateReferralLink(id, updateData);
  }

  @Post('referrals')
  @ApiOperation({ summary: 'Create new referral link' })
  async createReferralLink(@Body() data: { provider: string; url: string; utmSource?: string; utmCampaign?: string; utmMedium?: string; isActive?: boolean }) {
    return this.adminService.createReferralLink(data);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get all user alerts' })
  async getAlerts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getAlerts(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Post('alerts/check')
  @ApiOperation({ summary: 'Force check alerts against live rates' })
  async triggerAlertCheck() {
    return this.adminService.triggerAlertCheck();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health logs' })
  async getHealthLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getHealthLogs(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get activity logs' })
  async getActivityLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getActivityLogs(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get users list' })
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  @Post('rates/refresh')
  @ApiOperation({ summary: 'Trigger a background refresh of all rates' })
  async triggerRateRefresh() {
    // Fire and forget or background job
    // this.ratesService.refreshAllRates();
    return { message: 'Rate refresh triggered successfully' };
  }
}
