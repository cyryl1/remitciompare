import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ComparisonService, Priority } from '../comparison/comparison.service';
import { CreateComparisonDto } from '../comparison/dto/create-comparison.dto';

@ApiTags('rates')
@Controller('api/rates')
export class RatesController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get('compare')
  @ApiOperation({ summary: 'Compare rates across providers' })
  @ApiResponse({ status: 200, description: 'Comparison rates' })
  async compare(
    @Query('sendAmount') sendAmount: string,
    @Query('sendCurrency') sendCurrency: string,
    @Query('receiveCurrency') receiveCurrency: string,
  ) {
    const dto = new CreateComparisonDto();
    dto.sendAmount = parseFloat(sendAmount) || 1000;
    dto.sourceCurrency = sendCurrency || 'GBP';
    dto.targetCurrency = receiveCurrency || 'NGN';
    dto.priority = Priority.MOST_RECEIVED;
    dto.fromCountry = 'GB'; // Mocks
    dto.toCountry = 'NG';   // Mocks
    
    // We don't save anonymous sessions automatically here to avoid duplicate comparisons
    // since the frontend calls POST /comparison to save.
    const result = await this.comparisonService.compare(dto, undefined, undefined, false);
    
    return result.allQuotes.map(q => ({
      providerId: q.provider, // We should map this properly, but slug acts as ID in frontend
      providerName: q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
      providerSlug: q.provider.toLowerCase(),
      providerLogo: `https://logo.clearbit.com/${q.provider.toLowerCase()}.com`, // Mock logo
      exchangeRate: q.exchangeRate,
      fee: q.totalFees,
      feeType: 'flat', // Simplified for frontend
      receiveAmount: q.recipientAmount,
      deliveryTime: q.deliveryEstimate || '1-3 days',
      deliveryMethods: [q.paymentMethod || 'Bank Transfer'],
      transferLimit: { min: 10, max: 50000 }, // Mock
      updatedAt: q.quoteTimestamp.toISOString(),
      badge: result.recommended?.provider === q.provider ? 'best_rate' : null
    }));
  }

  @Get('history')
  @ApiOperation({ summary: 'Get historical rates' })
  async getHistory(
    @Query('sendCurrency') sendCurrency: string = 'GBP',
    @Query('receiveCurrency') receiveCurrency: string = 'NGN',
    @Query('days') days: string = '30',
  ) {
    const hoursNum = (parseInt(days, 10) || 30) * 24;
    const snapshots = await this.comparisonService.getSnapshots(sendCurrency.toUpperCase(), receiveCurrency.toUpperCase(), hoursNum);
    return snapshots.map(s => ({
      date: s.createdAt.toISOString(),
      rate: s.exchangeRate,
      provider: s.provider // We might need the name here
    }));
  }
  
  @Get('latest')
  @ApiOperation({ summary: 'Get latest rate' })
  async getLatest(
    @Query('sendCurrency') sendCurrency: string = 'GBP',
    @Query('receiveCurrency') receiveCurrency: string = 'NGN',
  ) {
    const snapshots = await this.comparisonService.getSnapshots(sendCurrency.toUpperCase(), receiveCurrency.toUpperCase(), 24);
    if (snapshots.length > 0) {
      // Return the most recent
      const latest = snapshots[snapshots.length - 1];
      return {
        rate: latest.exchangeRate,
        updatedAt: latest.createdAt.toISOString(),
      };
    }
    // Fallback if no history
    return {
      rate: 1.0,
      updatedAt: new Date().toISOString(),
    };
  }
}
