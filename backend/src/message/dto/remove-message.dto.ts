import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
