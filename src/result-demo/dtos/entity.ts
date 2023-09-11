import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Entity {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;
}
