import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SnapshotProducer } from './snapshot.producer';
import { SnapshotProcessor } from './snapshot.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { ProvidersModule } from '../providers/providers.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshot-queue',
    }),
    PrismaModule,
    ProvidersModule, // Need this to access PROVIDER_ADAPTERS
    AlertsModule,
  ],
  providers: [SnapshotProducer, SnapshotProcessor],
})
export class WorkersModule {}
