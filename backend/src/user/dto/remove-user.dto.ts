import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
