import { Controller, Get } from '@nestjs/common';
import { UrlManipulationService } from './url-manipulation.service';

@Controller('url-manipulation')
export class UrlManipulationController {
  constructor(
    private readonly urlManipulationService: UrlManipulationService,
  ) {}

  @Get()
  public async transformUrl(): Promise<string> {
    return await this.urlManipulationService.transformUrl();
  }
}
