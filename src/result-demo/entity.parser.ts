import { Injectable } from '@nestjs/common';
import { transformAndValidate } from 'class-transformer-validator';
import { failure, Result, success } from '../result/result';
import { CreateEntity } from './dtos/create-entity';
import { ParserValidationException } from './exceptions/parser-validation-exception';

@Injectable()
export class EntityParser {
  async parseCreateEntityInput(
    data: object,
  ): Promise<Result<CreateEntity, ParserValidationException>> {
    try {
      return success(await transformAndValidate(CreateEntity, data));
    } catch (e: any) {
      return failure(new ParserValidationException('Validation failed!', e));
    }
  }
}
