import { Controller, Get, Param } from '@nestjs/common';

@Controller('url-manipulation')
export class UrlManipulationController {
  @Get(':url')
  transformUrl(@Param('url') url: string): string {
    return url;
  }
}
