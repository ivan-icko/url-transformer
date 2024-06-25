import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UrlManipulationModule } from './modules/url-manipulation/url-manipulation.module';
import { HelloWorldModule } from './modules/hello-world/hello-world.module';

@Module({
  imports: [HelloWorldModule, UrlManipulationModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
