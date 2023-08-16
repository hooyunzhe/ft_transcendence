import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsNumber()
  p1_id: number;

  @IsNotEmpty()
  @IsNumber()
  p2_id: number;

  @IsNotEmpty()
  @IsNumber()
  winner_id: number;

  @IsNotEmpty()
  @IsNumber()
  p1_score: number;

  @IsNotEmpty()
  @IsNumber()
  p2_score: number;

  @IsNotEmpty()
  @IsNumber()
  skill1_id: number;

  @IsNotEmpty()
  @IsNumber()
  skill2_id: number;

  @IsNotEmpty()
  @IsNumber()
  skill3_id: number;

  @IsNotEmpty()
  @IsNumber()
  skill4_id: number;

  @IsNotEmpty()
  @IsNumber()
  skill5_id: number;
}
