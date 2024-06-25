import { Module } from '@nestjs/common';
import { UrlManipulationController } from './url-manipulation.controller';
import { UrlManipulationService } from './url-manipulation.service';

@Module({
  controllers: [UrlManipulationController],
  providers: [UrlManipulationService],
})
export class UrlManipulationModule {}
