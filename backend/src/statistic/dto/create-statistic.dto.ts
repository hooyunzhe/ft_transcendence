import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
