import { Module } from '@nestjs/common';
import { WiseAdapter } from './adapters/wise/wise.adapter';

export const PROVIDER_ADAPTERS = 'PROVIDER_ADAPTERS';

@Module({
  providers: [
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
