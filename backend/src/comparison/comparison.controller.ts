import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import type { Request, Response } from 'express';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('comparison')
@Controller('api/comparison')
export class ComparisonController {
  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Get live comparison quotes' })
  @ApiResponse({ status: 200, description: 'Comparison results' })
  async getComparison(
    @Query() dto: CreateComparisonDto,
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

    return this.comparisonService.compare(dto, user?.id, anonymousSessionId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comparison history for logged in user' })
  @ApiResponse({ status: 200, description: 'User history' })
  async getHistory(@Req() req: Request) {
    const user = req.user as any;
    return this.prisma.comparison.findMany({
      where: { userId: user.id },
      include: {
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to last 20 searches
    });
  }
}
