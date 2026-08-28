import { Module } from '@nestjs/common';
import { WiseAdapter } from './adapters/wise/wise.adapter';
import { LemFiAdapter } from './adapters/lemfi/lemfi.adapter';
import { RemitlyAdapter } from './adapters/remitly/remitly.adapter';
import { WorldRemitAdapter } from './adapters/worldremit/worldremit.adapter';
import { WesternUnionAdapter } from './adapters/westernunion/westernunion.adapter';
import { RevolutAdapter } from './adapters/revolut/revolut.adapter';
import { SendwaveAdapter } from './adapters/sendwave/sendwave.adapter';
import { RiaAdapter } from './adapters/ria/ria.adapter';
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
    WesternUnionAdapter,
    RevolutAdapter,
    SendwaveAdapter,
    RiaAdapter,
    {
      provide: PROVIDER_ADAPTERS,
      useFactory: (
        wise: WiseAdapter,
        lemfi: LemFiAdapter,
        remitly: RemitlyAdapter,
        worldremit: WorldRemitAdapter,
        wu: WesternUnionAdapter,
        rev: RevolutAdapter,
        sw: SendwaveAdapter,
        ria: RiaAdapter,
      ) => {
        return [wise, lemfi, remitly, worldremit, wu, rev, sw, ria];
      },
      inject: [
        WiseAdapter, LemFiAdapter, RemitlyAdapter, WorldRemitAdapter,
        WesternUnionAdapter, RevolutAdapter, SendwaveAdapter, RiaAdapter
      ],
    },
  ],
  exports: [PROVIDER_ADAPTERS],
})
export class ProvidersModule {}
