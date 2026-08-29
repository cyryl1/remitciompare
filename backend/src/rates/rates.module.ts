import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { ComparisonModule } from '../comparison/comparison.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ComparisonModule, PrismaModule],
  controllers: [RatesController],
})
export class RatesModule {}
