import { ForbiddenException, Injectable } from '@nestjs/common';
import { Failure, failure, Result, success } from '../result/result';
import { CreateEntity } from './dtos/create-entity';
import { Entity } from './dtos/entity';
import { EntityParser } from './entity.parser';
import { DeleteFailedException } from './exceptions/delete-failed-exception';
import { ParserValidationException } from './exceptions/parser-validation-exception';
import { SaveFailedException } from './exceptions/save-failed-exception';

@Injectable()
export class ResultDemoService {
  readonly seedDb: Readonly<Entity[]> = Object.freeze([
    Object.freeze({ name: 'duplicated', age: 1 }),
    Object.freeze({ name: 'duplicated-but-expired', age: -1 }),
  ]);

  dummyDb: CreateEntity[] = [...this.seedDb];

  constructor(private readonly parser: EntityParser) {}

  async findAll(): Promise<Entity[]> {
    return this.dummyDb.filter((item) => item.age > 0);
  }

  async findOneByName(name: string): Promise<Entity | null> {
    const entity = this.dummyDb.find(
      (item) => item.name === name && item.age > 0,
    );
    return entity ?? null;
  }

  /**
   * Saves a new Entity.
   */
  async save(
    obj: CreateEntity,
  ): Promise<Result<Entity, SaveFailedException | ParserValidationException>> {
    const validation = await this.parser.parseCreateEntityInput(obj);
    if (failure.is(validation)) {
      return validation;
    }

    if (await this.findOneByName(obj.name)) {
      return failure(
        new SaveFailedException(
          `Save failed - name "${obj.name}" is duplicated!`,
        ),
      );
    }
    this.dummyDb.push(obj);
    return success(obj);
  }

  /**
   * Deletes an Entity.
   */
  async delete(name: string): Promise<Result<boolean, DeleteFailedException>> {
    const index = this.dummyDb.findIndex((item) => item.name === name);
    if (index === -1) {
      return failure(
        new DeleteFailedException('Delete failed - entity not found!'),
      );
    }
    this.dummyDb.splice(index, 1);
    return success(true);
  }
}
