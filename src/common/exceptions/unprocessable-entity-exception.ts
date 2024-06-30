import { HttpStatus } from '@nestjs/common';
import { UNPROCESSABLE_ENTITY_ERROR } from '../constants/error-codes';
import { AbstractException } from './abstract.exception';

export class UnprocessableEntityException extends AbstractException {
  constructor(
    error: string,
    internalCode = UNPROCESSABLE_ENTITY_ERROR,
    userMessage = 'Unprocessable entity',
    meta: object = {},
    message = '',
    httpCode = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(error, internalCode, userMessage, meta, message, httpCode);
  }
}
