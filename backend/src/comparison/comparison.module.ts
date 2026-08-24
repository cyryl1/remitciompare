import { Module } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ComparisonController } from './comparison.controller';
import { ProvidersModule } from '../providers/providers.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ProvidersModule, PrismaModule],
  controllers: [ComparisonController],
  providers: [ComparisonService],
  exports: [ComparisonService],
})
export class ComparisonModule {}
