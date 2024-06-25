import { Controller, Get } from '@nestjs/common';

@Controller('url-manipulation')
export class UrlManipulationController {
  @Get()
  transformUrl(): string {
    return 'poz';
  }
}
