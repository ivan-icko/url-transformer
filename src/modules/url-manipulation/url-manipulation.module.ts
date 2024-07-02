import { Module } from '@nestjs/common';
import { UrlManipulationController } from './url-manipulation.controller';
import { UrlManipulationService } from './url-manipulation.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [UrlManipulationController],
  providers: [UrlManipulationService],
})
export class UrlManipulationModule {}
