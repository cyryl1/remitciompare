import { Module } from '@nestjs/common';
import { WiseAdapter } from './adapters/wise/wise.adapter';
import { LemFiAdapter } from './adapters/lemfi/lemfi.adapter';
import { RemitlyAdapter } from './adapters/remitly/remitly.adapter';
import { WorldRemitAdapter } from './adapters/worldremit/worldremit.adapter';
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
    LemFiAdapter,
    RemitlyAdapter,
    WorldRemitAdapter,
    {
      provide: PROVIDER_ADAPTERS,
      useFactory: (
        wise: WiseAdapter,
        lemfi: LemFiAdapter,
        remitly: RemitlyAdapter,
        worldremit: WorldRemitAdapter,
      ) => {
        return [wise, lemfi, remitly, worldremit];
      },
      inject: [WiseAdapter, LemFiAdapter, RemitlyAdapter, WorldRemitAdapter],
    },
  ],
  exports: [PROVIDER_ADAPTERS],
})
export class ProvidersModule {}
