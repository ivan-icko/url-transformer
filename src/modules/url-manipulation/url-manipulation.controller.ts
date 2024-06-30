import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { UrlManipulationService } from './url-manipulation.service';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-excetpion.filter';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggerInterceptor)
@Controller('url-manipulation')
export class UrlManipulationController {
  constructor(
    private readonly urlManipulationService: UrlManipulationService,
  ) {}

  @Get()
  public async transformUrl(): Promise<any> {
    return await this.urlManipulationService.transformUrls();
  }
}
