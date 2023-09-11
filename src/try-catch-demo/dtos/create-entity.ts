import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateEntity {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  age: number;
}
