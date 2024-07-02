import { isOkForCache, resolveKey } from '../../utils/cache.util';
import { ERROR_CACHE_EMPTY_VALUE } from '../../constants/error-codes';
import { CacheService } from '../../modules/cache/cache.service';
import { ValidationException } from '../../exceptions/validation.exception';
import { CacheException } from '../../exceptions/cache.exception';

interface CacheOptions {
  ttl?: number;
}

export const defaultTTL = 60 * 60 * 24 * 365;

export const CacheMethodResult = (options?: CacheOptions): MethodDecorator => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const key = resolveKey(target.constructor.name, propertyKey, args);
      const result = await cacheService.getFromCache(key);

      if (result) {
        return result;
      }

      const resultFromOriginal = await originalMethod.apply(this, args);

      if (!isOkForCache(resultFromOriginal)) {
        throw new ValidationException(
          `Empty result cant be stored in cache for ${target.constructor.name}, ${propertyKey}`,
          ERROR_CACHE_EMPTY_VALUE,
        );
      }

      const ttl =
        typeof options?.ttl !== 'undefined' && options?.ttl > 0
          ? options.ttl
          : defaultTTL;
      if (
        !(await cacheService.setCache(
          key,
          prepareResultsForCache(resultFromOriginal),
          ttl,
        ))
      ) {
        throw new CacheException('Caching store error');
      }

      return resultFromOriginal;
    };

    return descriptor;
  };
};

export let cacheService: CacheService;

export const setCacheService = async (service: CacheService) => {
  cacheService = service;
};

export const prepareResultsForCache = (result) => {
  return JSON.stringify({
    resultFromOriginal: result,
  });
};
