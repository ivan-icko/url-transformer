import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  sayHello(): string {
    return 'Hello, World!';
  }
}
