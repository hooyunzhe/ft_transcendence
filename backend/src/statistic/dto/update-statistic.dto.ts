import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStatisticDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  match_id: number;
}
