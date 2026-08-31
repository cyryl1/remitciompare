import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SnapshotProducer } from './snapshot.producer';
import { SnapshotProcessor } from './snapshot.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { ProvidersModule } from '../providers/providers.module';
import { AlertsModule } from '../alerts/alerts.module';
import { EmailModule } from '../email/email.module';
import { ComparisonModule } from '../comparison/comparison.module';
import { AlertsWorkerService } from './alerts.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshot-queue',
    }),
    PrismaModule,
    ProvidersModule, // Need this to access PROVIDER_ADAPTERS
    AlertsModule,
    EmailModule,
    ComparisonModule,
  ],
  providers: [SnapshotProducer, SnapshotProcessor, AlertsWorkerService],
  exports: [AlertsWorkerService],
})
export class WorkersModule {}
