import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveStatisticDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
