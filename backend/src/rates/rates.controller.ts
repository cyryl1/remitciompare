import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ComparisonService } from '../comparison/comparison.service';

@ApiTags('rates')
@Controller('api/rates')
export class RatesController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get('snapshots')
  @ApiOperation({ summary: 'Get historical rate snapshots for a specific route' })
  @ApiResponse({ status: 200, description: 'Rate snapshots' })
  async getSnapshots(
    @Query('source') source: string = 'GBP',
    @Query('target') target: string = 'NGN',
    @Query('hours') hours: string = '24',
  ) {
    const hoursNum = parseInt(hours, 10) || 24;
    return this.comparisonService.getSnapshots(source.toUpperCase(), target.toUpperCase(), hoursNum);
  }
}
