import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active alerts for user' })
  async getAlerts(@Req() req: any) {
    return this.alertsService.getAlerts(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new rate alert' })
  async createAlert(@Req() req: any, @Body() body: any) {
    return this.alertsService.createAlert(req.user.id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an alert' })
  async updateAlert(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.alertsService.updateAlert(req.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an alert' })
  async deleteAlert(@Req() req: any, @Param('id') id: string) {
    return this.alertsService.deleteAlert(req.user.id, id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle an alert status' })
  async toggleAlert(@Req() req: any, @Param('id') id: string) {
    return this.alertsService.toggleAlert(req.user.id, id);
  }
}
