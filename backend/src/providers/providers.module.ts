import { Module } from '@nestjs/common';
import { WiseAdapter } from './adapters/wise/wise.adapter';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from '../prisma/prisma.module';

export const PROVIDER_ADAPTERS = 'PROVIDER_ADAPTERS';

@Module({
  imports: [PrismaModule],
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    WiseAdapter,
    {
      provide: PROVIDER_ADAPTERS,
      useFactory: (wise: WiseAdapter) => {
        return [wise];
      },
      inject: [WiseAdapter],
    },
  ],
  exports: [PROVIDER_ADAPTERS],
})
export class ProvidersModule {}
