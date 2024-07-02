import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { REDIS_CLIENT } from '../../constants/general';
import { setCacheService } from '../../decorators/cache/cache.decorator';
import Redis from 'ioredis';

export class CacheService implements OnApplicationBootstrap {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await setCacheService(this);
  }

  async setCache(
    key: string,
    value: string,
    ttl: number = 60 * 60 * 24 * 365,
  ): Promise<boolean> {
    try {
      await this.redisClient.set(key, value, 'EX', ttl);
    } catch (e) {
      return false;
    }

    return true;
  }

  async getFromCache(key: string): Promise<any> {
    let resultFromRedis: any;
    try {
      resultFromRedis = await this.redisClient.get(key);
    } catch (e) {
      resultFromRedis = false;
    }

    if (resultFromRedis) {
      return JSON.parse(resultFromRedis).resultFromOriginal;
    }

    return null;
  }
}
