import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlManipulationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async transformUrl(): Promise<string> {
    // await this.cacheManager.del('key');
    const value = await this.cacheManager.get('key');
    if (value) {
      return value.toString();
    }
    await this.cacheManager.set('key', 'value', 1000);
    return 'initial value';
  }
}
