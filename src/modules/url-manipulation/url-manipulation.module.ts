import { Module } from '@nestjs/common';
import { UrlManipulationController } from './url-manipulation.controller';
import { UrlManipulationService } from './url-manipulation.service';
import { ServicesModule } from '../services/services.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONFIG } from 'common/constants/general';

@Module({
  imports: [
    ServicesModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: configService.get(DATABASE_CONFIG).nodeCache.ttl,
        } as CacheModuleOptions;
      },
    }),
  ],
  controllers: [UrlManipulationController],
  providers: [UrlManipulationService],
})
export class UrlManipulationModule {}
