import { Inject } from '@nestjs/common';
import { AbstractRestService } from '../abstract-rest.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../../common/modules/logger/logger.service';
import { VERCEL_TEST_SERVICE } from '../../../common/constants/general';
import { RestServiceException } from '../../../common/exceptions/rest-service.exception';
import { VercelTestResponseDto } from './dto/vercel-test.response.dto';

export class VercelTestService extends AbstractRestService {
  constructor(
    @Inject(HttpService)
    protected readonly httpService: HttpService,
    @Inject(ConfigService)
    protected readonly configService: ConfigService,
    @Inject(LoggerService)
    protected readonly logger: LoggerService,
  ) {
    super(httpService, logger, configService);
    this.svcName = VERCEL_TEST_SERVICE;
  }

  async getTestFileUrls(): Promise<VercelTestResponseDto> {
    try {
      const response = await this.get('api/test');
      return response.data;
    } catch (error) {
      this.logger.error(
        `${this.constructor['name']}:: Error calling Vercel test service: ${error}`,
      );
      throw new RestServiceException('Error calling Vercel test service');
    }
  }
}
