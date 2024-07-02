import { Injectable } from '@nestjs/common';
import { VercelTestService } from '../services/vercel-test/vercel-test.service';
import {
  FileStructure,
  UrlManipulationResponseDto,
} from './dto/url-manipulation.response.dto';

@Injectable()
export class UrlManipulationService {
  constructor(private readonly vercelTestService: VercelTestService) {}

  /**
   * Fetches the data from the API and processes it to return the desired structure.
   * @returns The processed data.
   */
  public async transformUrls(): Promise<UrlManipulationResponseDto> {
    const data = await this.vercelTestService.getTestFileUrls();
    const result: UrlManipulationResponseDto = {};
    data.items.forEach((fileUrlObject) => {
      this.processUrl(fileUrlObject.fileUrl, result);
    });
    return result;
  }

  private processUrl(url: string, result: UrlManipulationResponseDto): void {
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
}
