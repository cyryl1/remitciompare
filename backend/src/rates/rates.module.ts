import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';

import { ComparisonModule } from '../comparison/comparison.module';

@Module({
  imports: [ComparisonModule],
  controllers: [RatesController]
})
export class RatesModule {}
