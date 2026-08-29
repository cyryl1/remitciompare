import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import type { Request, Response } from 'express';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('comparison')
@Controller('api/comparison')
export class ComparisonController {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('history')
  @UseGuards(OptionalJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get comparison history for logged in or anonymous user',
  })
  @ApiResponse({ status: 200, description: 'User history' })
  async getHistory(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const user = req.user as any;
    const anonymousSessionId = req.cookies?.anonymous_session;

    if (!user && !anonymousSessionId) {
      return {
        data: [],
        total: 0,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
    }

    const whereClause = user ? { userId: user.id } : { anonymousSessionId };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [comparisons, total] = await Promise.all([
      this.prisma.comparison.findMany({
        where: whereClause,
        include: { quotes: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.comparison.count({ where: whereClause }),
    ]);

    const data = comparisons.map((c) => {
      const bestQuote =
        c.quotes.length > 0
          ? c.quotes.reduce((prev, curr) =>
              prev.recipientAmount > curr.recipientAmount ? prev : curr,
            )
          : null;

      return {
        id: c.id,
        sendAmount: c.sendAmount,
        sendCurrency: c.fromCurrency,
        receiveCurrency: c.toCurrency,
        createdAt: c.createdAt.toISOString(),
        bestProviderName: bestQuote
          ? bestQuote.provider.charAt(0).toUpperCase() +
            bestQuote.provider.slice(1)
          : 'Unknown',
        bestReceiveAmount: bestQuote ? bestQuote.recipientAmount : 0,
        results: c.quotes.map((q) => ({
          providerId: q.provider,
          providerName:
            q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
          providerSlug: q.provider.toLowerCase(),
          exchangeRate: q.exchangeRate,
          fee: Number(q.totalFees),
          receiveAmount: q.recipientAmount,
          deliveryTime: q.deliveryEstimate || '1-3 days',
          badge: q.isBestValue ? 'best_rate' : null,
        })),
      };
    });

    return { data, total, page: parseInt(page, 10), limit: take };
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Get a single comparison by ID' })
  async getComparisonById(@Param('id') id: string) {
    const c = await this.prisma.comparison.findUnique({
      where: { id },
      include: { quotes: true },
    });
    if (!c) return null;
    return {
      id: c.id,
      sendAmount: c.sendAmount,
      sendCurrency: c.fromCurrency,
      receiveCurrency: c.toCurrency,
      createdAt: c.createdAt.toISOString(),
      results: c.quotes.map((q) => ({
        providerId: q.provider,
        providerName: q.provider.charAt(0).toUpperCase() + q.provider.slice(1),
        providerSlug: q.provider.toLowerCase(),
        exchangeRate: q.exchangeRate,
        fee: Number(q.totalFees),
        receiveAmount: q.recipientAmount,
        deliveryTime: q.deliveryEstimate || '1-3 days',
        badge: q.isBestValue ? 'best_rate' : null,
      })),
    };
  }

  @Post()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Save a comparison' })
  async saveComparison(
    @Body() payload: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    let anonymousSessionId = req.cookies?.anonymous_session;

    if (!user && !anonymousSessionId) {
      anonymousSessionId = uuidv4();
      res.cookie('anonymous_session', anonymousSessionId, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 72 hours
      });
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    const comparison = await this.prisma.comparison.create({
      data: {
        userId: user?.id,
        anonymousSessionId,
        fromCurrency: payload.sendCurrency,
        toCurrency: payload.receiveCurrency,
        fromCountry: 'GB', // Mock for MVP
        toCountry: 'NG', // Mock for MVP
        sendAmount: payload.sendAmount,
        priority: 'MOST_RECEIVED',
        staleAt: expirationDate,
        quotes: {
          create: payload.results.map((q: any) => ({
            provider: q.providerId,
            exchangeRate: q.exchangeRate,
            totalFees: q.fee,
            recipientAmount: q.receiveAmount,
            grossRecipientAmount: q.receiveAmount, // MVP mock
            deliveryEstimate: q.deliveryTime,
            paymentMethod: 'BANK_TRANSFER', // MVP mock
            fees: {}, // MVP mock
            isBestValue: q.badge === 'best_rate',
            status: 'SUCCESS',
            quoteTimestamp: new Date(),
          })),
        },
      },
      include: { quotes: true },
    });

    return {
      id: comparison.id,
      sendAmount: comparison.sendAmount,
      sendCurrency: comparison.fromCurrency,
      receiveCurrency: comparison.toCurrency,
      createdAt: comparison.createdAt.toISOString(),
      results: payload.results,
    };
  }
}
