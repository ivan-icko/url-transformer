import { Module } from '@nestjs/common';
import { UrlManipulationController } from './url-manipulation.controller';
import { UrlManipulationService } from './url-manipulation.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [UrlManipulationController],
  providers: [UrlManipulationService],
})
export class UrlManipulationModule {}
