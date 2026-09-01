import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ComparisonService, Priority } from '../comparison/comparison.service';
import { CreateComparisonDto } from '../comparison/dto/create-comparison.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CURRENCY_TO_COUNTRY } from '../utils/currencies';

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
    @Query('amount') amount: string,
    @Query('sendCurrency') sendCurrency: string,
    @Query('receiveCurrency') receiveCurrency: string,
    @Query('priority') priority: Priority = Priority.MOST_RECEIVED,
    @Query('providerSlug') providerSlug?: string,
  ) {
    const dto = new CreateComparisonDto();
    dto.sendAmount = amount ? parseFloat(amount) : 500;
    dto.sourceCurrency = sendCurrency || 'GBP';
    dto.targetCurrency = receiveCurrency || 'NGN';
    dto.priority = priority;
    dto.providerSlug = providerSlug;

    dto.fromCountry =
      CURRENCY_TO_COUNTRY[dto.sourceCurrency.toUpperCase()]?.toUpperCase() ||
      dto.sourceCurrency.substring(0, 2).toUpperCase();
    dto.toCountry =
      CURRENCY_TO_COUNTRY[dto.targetCurrency.toUpperCase()]?.toUpperCase() ||
      dto.targetCurrency.substring(0, 2).toUpperCase();

    // We don't save anonymous sessions automatically here to avoid duplicate comparisons
    // since the frontend calls POST /comparison to save.
    try {
      const result = await this.comparisonService.compare(
        dto,
        undefined,
        undefined,
        false,
      );
      const providers = await this.prisma.provider.findMany();
      const logoMap = new Map();
      const urlMap = new Map();
      const slugMap = new Map();
      providers.forEach((p) => {
        let logo = p.logoUrl;
        try {
          if (p.websiteUrl) {
            const domain = new URL(p.websiteUrl).hostname;
            logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          }
        } catch (e) {
          // fallback to DB logo if URL parsing fails
        }
        logoMap.set(p.name.toLowerCase(), logo);
        slugMap.set(p.name.toLowerCase(), p.slug);
      });

      const successfulQuotes = result.allQuotes.filter(q => q.status === 'SUCCESS');
      let bestRateProvider = null;
      if (successfulQuotes.length > 0) {
        bestRateProvider = [...successfulQuotes].sort((a, b) => b.recipientAmount - a.recipientAmount)[0].provider;
      }

      return result.allQuotes.map((q) => {
        const slug = q.provider.toLowerCase().replace(/\s+/g, '');
        
        const badges: string[] = [];
        if (result.recommended?.provider === q.provider) {
          badges.push('recommended');
        }
        if (q.provider === bestRateProvider) {
          badges.push('best_rate');
        }

        return {
          providerId: slug,
          providerName: q.provider,
          providerSlug: slug,
          providerLogo: logoMap.get(q.provider.toLowerCase()),
          handoffUrl: `/api/rates/referral/${slugMap.get(q.provider.toLowerCase()) || slug}`,
          exchangeRate: q.exchangeRate,
          fee: q.totalFees,
          feeType: 'flat', // Simplified for frontend
          receiveAmount: q.recipientAmount,
          deliveryTime: q.deliveryEstimate || '1-3 days',
          deliveryMethods: [q.paymentMethod || 'Bank Transfer'],
          transferLimit: { min: 10, max: 50000 }, // Mock
          updatedAt: q.quoteTimestamp.toISOString(),
          status: q.status,
          badges,
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
    const snapshots = await this.comparisonService.getSnapshots(
      sendCurrency.toUpperCase(),
      receiveCurrency.toUpperCase(),
      hoursNum,
    );
    return snapshots.map((s) => ({
      date: s.createdAt.toISOString(),
      rate: s.exchangeRate,
      provider: s.provider, // We might need the name here
    }));
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest rate' })
  async getLatest(
    @Query('sendCurrency') sendCurrency: string = 'GBP',
    @Query('receiveCurrency') receiveCurrency: string = 'NGN',
  ) {
    const snapshots = await this.comparisonService.getSnapshots(
      sendCurrency.toUpperCase(),
      receiveCurrency.toUpperCase(),
      24,
    );
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

  @Get('referral/:slug')
  @ApiOperation({ summary: 'Redirect to provider via referral link' })
  @Redirect()
  async handleReferralRedirect(@Param('slug') slug: string) {
    // 1. Find the provider
    const provider = await this.prisma.provider.findUnique({
      where: { slug }
    });

    if (!provider) {
      return { url: '/', statusCode: 302 }; // fallback to home
    }

    // 2. Find an active referral link for this provider
    const referralLink = await this.prisma.referralLink.findFirst({
      where: {
        provider: provider.name,
        isActive: true,
      }
    });

    if (referralLink) {
      // Increment click count
      await this.prisma.referralLink.update({
        where: { id: referralLink.id },
        data: { clickCount: { increment: 1 } }
      });

      // Construct URL with UTM params
      let finalUrl = referralLink.url;
      const urlObj = new URL(finalUrl);
      if (referralLink.utmSource) urlObj.searchParams.set('utm_source', referralLink.utmSource);
      if (referralLink.utmCampaign) urlObj.searchParams.set('utm_campaign', referralLink.utmCampaign);
      
      return { url: urlObj.toString(), statusCode: 302 };
    }

    // 3. Fallback to basic affiliate URL or website URL
    const fallbackUrl = provider.affiliateUrl || provider.websiteUrl || `https://${provider.name.toLowerCase().replace(/\s+/g, '')}.com`;
    return { url: fallbackUrl, statusCode: 302 };
  }
}
