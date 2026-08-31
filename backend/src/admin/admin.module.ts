import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { PrismaModule } from '../prisma/prisma.module';
import { WorkersModule } from '../workers/workers.module';

@Module({
  imports: [PrismaModule, WorkersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
