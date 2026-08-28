import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ComparisonService, Priority } from '../comparison/comparison.service';
import { CreateComparisonDto } from '../comparison/dto/create-comparison.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('rates')
@Controller('api/rates')
export class RatesController {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly prisma: PrismaService,
  ) {}

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
    
    // Simple mock mapping for from/to countries based on currency
    const currencyToCountry: Record<string, string> = {
      'GBP': 'GB',
      'USD': 'US',
      'EUR': 'FR', // or 'DE', etc
      'CAD': 'CA',
      'AUD': 'AU',
      'NGN': 'NG',
      'KES': 'KE',
      'GHS': 'GH',
      'INR': 'IN',
    };
    
    dto.fromCountry = currencyToCountry[dto.sourceCurrency.toUpperCase()] || dto.sourceCurrency.substring(0, 2).toUpperCase();
    dto.toCountry = currencyToCountry[dto.targetCurrency.toUpperCase()] || dto.targetCurrency.substring(0, 2).toUpperCase();
    
    // We don't save anonymous sessions automatically here to avoid duplicate comparisons
    // since the frontend calls POST /comparison to save.
    try {
      const result = await this.comparisonService.compare(dto, undefined, undefined, false);
      const providers = await this.prisma.provider.findMany();
      const logoMap = new Map(providers.map(p => {
        let logo = p.logoUrl;
        try {
          if (p.websiteUrl) {
            const domain = new URL(p.websiteUrl).hostname;
            logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          }
        } catch (e) {
          // fallback to DB logo if URL parsing fails
        }
        return [p.name.toLowerCase(), logo];
      }));
      
      return result.allQuotes.map(q => {
        const slug = q.provider.toLowerCase().replace(/\s+/g, '');
        return {
          providerId: slug,
          providerName: q.provider,
          providerSlug: slug,
          providerLogo: logoMap.get(q.provider.toLowerCase()),
          exchangeRate: q.exchangeRate,
          fee: q.totalFees,
          feeType: 'flat', // Simplified for frontend
          receiveAmount: q.recipientAmount,
          deliveryTime: q.deliveryEstimate || '1-3 days',
          deliveryMethods: [q.paymentMethod || 'Bank Transfer'],
          transferLimit: { min: 10, max: 50000 }, // Mock
          updatedAt: q.quoteTimestamp.toISOString(),
          badge: result.recommended?.provider === q.provider ? 'best_rate' : null
        };
      });
    } catch (error) {
      console.error('ERROR in rates.controller.compare:', error);
      throw new (require('@nestjs/common').HttpException)(error.message, 500);
    }
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
