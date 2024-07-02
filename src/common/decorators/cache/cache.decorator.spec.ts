import { Test, TestingModule } from '@nestjs/testing';
import {
  CacheMethodResult,
  defaultTTL,
  setCacheService,
} from './cache.decorator';
import * as cacheUtil from '../../utils/cache.util';
import { CacheService } from '../../modules/cache/cache.service';
import { ValidationException } from '../../exceptions/validation.exception';

const retKey = 'key';
let isOkForCacheResult = true;

const resolveKey = jest.fn().mockImplementation(() => {
  return retKey;
});
const isOkForCache = jest.fn().mockImplementation(() => {
  return isOkForCacheResult;
});
jest.spyOn(cacheUtil, 'resolveKey').mockImplementation(() => {
  return resolveKey();
});
jest.spyOn(cacheUtil, 'isOkForCache').mockImplementation(() => {
  return isOkForCache();
});
let setCacheResult: any = true;
const setCache = jest.fn().mockImplementation(() => setCacheResult);
const getFromCache = jest.fn();
const CacheServiceMock = jest.fn().mockImplementation(() => {
  return {
    setCache,
    getFromCache,
  };
});

export const MockCacheService = {
  provide: CacheService,
  useClass: CacheServiceMock,
};

let testMethodImplementationResult;
const testMethodImplementation = () => testMethodImplementationResult;

const cacheOptions = {
  ttl: 5,
};

const dummyObject = { dummy: 'dummy' };

class TestClass {
  @CacheMethodResult()
  testMethod1() {
    return testMethodImplementation();
  }

  @CacheMethodResult(cacheOptions)
  testMethod2() {
    return testMethodImplementation();
  }
}

describe('Cache decorator', () => {
  const testClass = new TestClass();
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockCacheService],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    await setCacheService(cacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('call decorated method without cache options - no results in cache', async () => {
    isOkForCacheResult = true;
    testMethodImplementationResult = dummyObject;
    const resForCache = JSON.stringify({
      resultFromOriginal: testMethodImplementationResult,
    });
    const res = await testClass.testMethod1();
    expect(resolveKey).toBeCalledTimes(1);
    expect(getFromCache).toBeCalledTimes(1);
    expect(getFromCache).toBeCalledWith(retKey);
    expect(res).toEqual(testMethodImplementationResult);
    expect(setCache).toBeCalledTimes(1);
    expect(setCache).toBeCalledWith(retKey, resForCache, defaultTTL);
  });

  it('call decorated method without cache options - with results in cache', async () => {
    isOkForCacheResult = true;
    testMethodImplementationResult = dummyObject;
    setCacheResult = JSON.stringify({ resultFromOriginal: dummyObject });
    const res = await testClass.testMethod1();
    expect(resolveKey).toBeCalledTimes(1);
    expect(getFromCache).toBeCalledTimes(1);
    expect(getFromCache).toBeCalledWith(retKey);
    expect(res).toEqual(dummyObject);
  });

  it('call decorated method with cache options', async () => {
    isOkForCacheResult = true;
    const resForCache = JSON.stringify({
      resultFromOriginal: testMethodImplementationResult,
    });
    await testClass.testMethod2();
    expect(setCache).toBeCalledWith(retKey, resForCache, cacheOptions.ttl);
  });

  it('call decorated method not cacheable', async () => {
    isOkForCacheResult = false;
    testMethodImplementationResult = false;
    try {
      await testClass.testMethod2();
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
    }
  });

  it('setCache failed', async () => {
    setCacheResult = false;
    try {
      await testClass.testMethod2();
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
    }
  });
});
