import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  /**
   * Returns a string containing the message "Hello, World!".
   * @returns A string containing the message "Hello, World!".
   */
  sayHello(): string {
    return 'Hello, World!';
  }
}
