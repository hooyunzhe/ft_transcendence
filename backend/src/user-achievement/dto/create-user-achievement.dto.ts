import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  achievement_id: number;
}
