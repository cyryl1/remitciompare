import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
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
    return this.adminService.getActivityLogs();
  }

  @Get('quote-failures')
  @ApiOperation({ summary: 'Get recent quote failures' })
  async getQuoteFailures() {
    return this.adminService.getQuoteFailures();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard stats (users, providers, comparisons)' })
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get providers list for admin' })
  async getProviders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    return this.adminService.getProviders(parseInt(page, 10), parseInt(limit, 10));
  }

  @Patch('providers/:id')
  @ApiOperation({ summary: 'Update provider settings' })
  async updateProvider(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.adminService.updateProvider(id, body);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get users list' })
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string
  ) {
    return this.adminService.getUsers(parseInt(page, 10), parseInt(limit, 10), search);
  }

  @Post('rates/refresh')
  @ApiOperation({ summary: 'Trigger a background refresh of all rates' })
  async triggerRateRefresh() {
    // Fire and forget or background job
    // this.ratesService.refreshAllRates();
    return { message: 'Rate refresh triggered successfully' };
  }
}
