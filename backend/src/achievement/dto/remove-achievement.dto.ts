import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
