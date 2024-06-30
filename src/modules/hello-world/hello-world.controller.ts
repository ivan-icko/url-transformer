import { Controller, Get } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for handling requests related to the "hello-world" endpoint.
 */
@ApiTags('hello-world')
@Controller('hello-world')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  /**
   * Handles GET requests to the "hello-world" endpoint.
   * @returns A string containing the response message.
   */
  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns the hello message' })
  getHello(): string {
    return this.helloWorldService.sayHello();
  }
}
