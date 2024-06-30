import { REST_SERVICE } from '../constants/error-codes';
import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class RestServiceException extends AbstractException {
  constructor(
    error: string,
    internalCode = REST_SERVICE,
    userMessage = '',
    meta: object = {},
    message = 'Exception calling service',
    httpCode = HttpStatus.SERVICE_UNAVAILABLE,
  ) {
    super(error, internalCode, userMessage, meta, message, httpCode);
  }
}
