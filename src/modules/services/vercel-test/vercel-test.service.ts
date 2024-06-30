import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/modules/logger/logger.service';

@Injectable()
export class VercelTestService {
  constructor(
    @Inject(LoggerService)
    protected readonly logger: LoggerService,
  ) {}

  async getVercelTestEndpoint(): Promise<any> {
    this.logger.info('Vercel test endpoint called');
    return 'Vercel test endpoint called';
  }
}
