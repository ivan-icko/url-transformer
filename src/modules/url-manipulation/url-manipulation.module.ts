import { Module } from '@nestjs/common';
import { UrlManipulationController } from './url-manipulation.controller';
import { UrlManipulationService } from './url-manipulation.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [CacheModule.register(), ServicesModule],
  controllers: [UrlManipulationController],
  providers: [UrlManipulationService],
})
export class UrlManipulationModule {}
