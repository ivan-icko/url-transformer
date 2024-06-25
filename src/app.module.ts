import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UrlManipulationModule } from './modules/url-manipulation/url-manipulation.module';

@Module({
  imports: [UrlManipulationModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
