import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ComparisonService, Priority } from './comparison.service';
import { QuoteRequest } from '../providers/interfaces/provider-adapter.interface';

@Controller('api/comparison')
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get()
  async getComparison(
    @Query('amount') amount: string,
    @Query('source') source: string = 'GBP',
    @Query('target') target: string = 'NGN',
    @Query('priority') priority: Priority = Priority.MOST_RECEIVED,
  ) {
    const sendAmount = parseFloat(amount);
    
    if (isNaN(sendAmount) || sendAmount <= 0) {
      throw new BadRequestException('Valid amount is required.');
    }

    const request: QuoteRequest = {
      sendAmount,
      sourceCurrency: source.toUpperCase(),
      targetCurrency: target.toUpperCase(),
    };

    return this.comparisonService.compare(request, priority);
  }
}
