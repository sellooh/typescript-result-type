import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Entity {
  @IsString()
  @IsNotEmpty()
  name: Readonly<string>;

  @IsNumber()
  @IsNotEmpty()
  age: number;
}
