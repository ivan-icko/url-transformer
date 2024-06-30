import { HttpStatus } from '@nestjs/common';
import { GENERAL_ERROR_CODE } from '../constants/error-codes';

export abstract class AbstractException extends Error {
  protected constructor(
    readonly error?: string,
    public code = GENERAL_ERROR_CODE,
    public userMessage = '',
    readonly meta?: object,
    public message = '',
    readonly status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super();
  }

  toString() {
    return `Error: ${this.error}; InternalCode: ${this.code}; UserMessage: ${this.message}`;
  }
}
