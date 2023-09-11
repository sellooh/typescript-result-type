import { ValidationError } from 'class-validator';

export class ParserValidationException extends Error {
  readonly name: 'ParserValidationException';
  validationErrors: ValidationError[];

  constructor(message: string, validationErrors) {
    super(message);
    this.message = message;
    this.validationErrors = validationErrors;
  }
}
