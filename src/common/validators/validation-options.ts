import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { UnprocessableEntityException } from '../exceptions/unprocessable-entity-exception';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    const errorsParsed = parseErrors(errors);
    return new UnprocessableEntityException(errorsParsed.toString());
  },
};

const parseErrors = (errors: ValidationError[]) => {
  return errors
    .reduce((accumulator, currentValue) => {
      const errorMessage = `${currentValue.property}: ${Object.values(
        currentValue.constraints,
      ).join(', ')}`;

      if (!currentValue.children || currentValue.children.length === 0) {
        accumulator.push(errorMessage);
      }

      if (
        currentValue.children &&
        currentValue.children[0] instanceof ValidationError
      ) {
        accumulator.push(parseErrors(currentValue.children));
      }
      return accumulator;
    }, [])
    .join('; ');
};

export default validationOptions;
