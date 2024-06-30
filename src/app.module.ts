import { Module } from '@nestjs/common';
import { UrlManipulationModule } from './modules/url-manipulation/url-manipulation.module';
import { HelloWorldModule } from './modules/hello-world/hello-world.module';
import { ServicesModule } from './modules/services/services.module';
import { LoggerModule } from './common/modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import logger from './config/logger.config';
import database from './config/database.config';
import servicesConfig from './config/services.config';
import generalConfig from './config/general.config';

@Module({
  imports: [
    HelloWorldModule,
    UrlManipulationModule,
    ServicesModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, logger, servicesConfig, generalConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
