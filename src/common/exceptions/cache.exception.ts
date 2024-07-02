import { ERROR_ACCESSING_CACHE } from '../constants/error-codes';
import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class CacheException extends AbstractException {
  constructor(
    error: string,
    internalCode = ERROR_ACCESSING_CACHE,
    userMessage = '',
    meta: object = {},
    message = 'Error accessing redis',
    httpCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(error, internalCode, userMessage, meta, message, httpCode);
  }
}
