import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
