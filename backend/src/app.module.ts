import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule } from './providers/providers.module';
import { ComparisonModule } from './comparison/comparison.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { WorkersModule } from './workers/workers.module';
import { validate } from './config/env.validation';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { RatesModule } from './rates/rates.module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: () => {
        const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
        return {
          connection: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port || '6379', 10),
            username: redisUrl.username || undefined,
            password: redisUrl.password || undefined,
          },
        };
      },
    }),
    PrismaModule,
    ProvidersModule,
    ComparisonModule,
    AuthModule,
    EmailModule,
    WorkersModule,
    RatesModule,
    UsersModule,
    AlertsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
