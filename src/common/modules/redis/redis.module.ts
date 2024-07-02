import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONFIG, REDIS_CLIENT } from '../../constants/general';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get(DATABASE_CONFIG).redis.host,
          port: configService.get(DATABASE_CONFIG).redis.port,
          db: configService.get(DATABASE_CONFIG).redis.database,
          keyPrefix: configService.get(DATABASE_CONFIG).redisGlobalPrefix,
          keepAlive: 200,
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
