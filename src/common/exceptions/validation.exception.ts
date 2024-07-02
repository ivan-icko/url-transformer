import { VALIDATION_ERROR } from '../constants/error-codes';
import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class ValidationException extends AbstractException {
  constructor(
    error: string,
    internalCode = VALIDATION_ERROR,
    userMessage = '',
    meta: object = {},
    message = 'Validation error',
    httpCode = HttpStatus.BAD_REQUEST,
  ) {
    super(error, internalCode, userMessage, meta, message, httpCode);
  }
}
