import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { UrlManipulationService } from './url-manipulation.service';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-excetpion.filter';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controller responsible for handling requests related to the "url-manipulation" endpoint.
 */
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggerInterceptor)
@ApiTags('url-manipulation')
@Controller('url-manipulation')
export class UrlManipulationController {
  constructor(
    private readonly urlManipulationService: UrlManipulationService,
  ) {}

  /**
   * Handles GET requests to the "url-manipulation" endpoint.
   * @returns A string containing the response message.
   */
  @Get()
  @ApiOperation({ summary: 'Transform URL' })
  @ApiResponse({ status: 200, description: 'Successfully transformed URL' })
  public async transformUrl(): Promise<any> {
    return await this.urlManipulationService.transformUrls();
  }
}
