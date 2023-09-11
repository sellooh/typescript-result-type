import { Injectable } from '@nestjs/common';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateEntity } from './dtos/create-entity';
import { Entity } from './dtos/entity';
import { DeleteFailedException } from './exceptions/delete-failed-exception';
import { SaveFailedException } from './exceptions/save-failed-exception';

@Injectable()
export class TryCatchDemoService {
  readonly seedDb: Readonly<Entity[]> = Object.freeze([
    Object.freeze({ name: 'duplicated', age: 1 }),
    Object.freeze({ name: 'duplicated-but-expired', age: -1 }),
  ]);

  dummyDb: CreateEntity[] = [...this.seedDb];

  async findAll(): Promise<Entity[]> {
    return this.dummyDb.filter((item) => item.age > 0);
  }

  async findOneByName(name: string): Promise<Entity> {
    return this.dummyDb.find((item) => item.name === name && item.age > 0);
  }

  /**
   * Saves a new Entity.
   *
   * @throws {SaveFailedException, ValidationError[]} If the save fails.
   */
  async save(obj: CreateEntity): Promise<Entity> {
    await transformAndValidate(CreateEntity, obj);

    if (await this.findOneByName(obj.name)) {
      throw new SaveFailedException(
        `Save failed - name "${obj.name}" is duplicated!`,
      );
    }
    this.dummyDb.push(obj);
    return obj;
  }

  /**
   * Deletes an Entity.
   *
   * @throws {DeleteFailedException} If the save fails.
   */
  async delete(name: string): Promise<boolean> {
    const index = this.dummyDb.findIndex((item) => item.name === name);
    if (index === -1) {
      throw new DeleteFailedException('Delete failed - entity not found!');
    }
    this.dummyDb.splice(index, 1);
    return true;
  }
}
