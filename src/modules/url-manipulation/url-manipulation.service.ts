import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { VercelTestService } from '../services/vercel-test/vercel-test.service';

interface FileStructure {
  [directory: string]: (string | FileStructure)[];
}

interface IpFileMap {
  [ip: string]: FileStructure[];
}

@Injectable()
export class UrlManipulationService {
  private readonly cacheKey = 'apiData';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly vercelTestService: VercelTestService,
  ) {}

  private processUrl(url: string, result: IpFileMap): void {
    const urlObject = new URL(url);
    const ip = urlObject.hostname;
    const paths = urlObject.pathname.split('/').filter((path) => path !== '');

    const currentLevel = (result[ip] = result[ip] || []);

    paths.reduce((acc: (string | FileStructure)[], path, index) => {
      const isLast = index === paths.length - 1;
      const existingPathIndex = acc.findIndex(
        (item) => typeof item === 'object' && Object.keys(item)[0] === path,
      );

      if (path.includes('.')) {
        // If it's a file, add it to the current level
        if (isLast) {
          acc.push(path);
        }
      } else {
        if (existingPathIndex === -1) {
          const newLevel: FileStructure = {};
          newLevel[path] = [];
          acc.push(newLevel);
          return newLevel[path];
        } else {
          return (acc[existingPathIndex] as FileStructure)[path];
        }
      }
      return acc;
    }, currentLevel);
  }

  public async transformUrls(): Promise<IpFileMap> {
    try {
      /*  const data: DataFile | undefined = await this.cacheManager.get(
        this.cacheKey,
      ); */
      const data = await this.vercelTestService.getVercelTestEndpoint();

      if (!data) {
        await this.cacheManager.set(this.cacheKey, data, 180);
      }

      const result: IpFileMap = {};
      data.items.forEach((fileUrlObject) => {
        this.processUrl(fileUrlObject.fileUrl, result);
      });

      return result;
    } catch (error) {
      console.error('Error fetching or processing the API data:', error);
      throw error;
    }
  }
}
