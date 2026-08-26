import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService]
})
export class AlertsModule {}
