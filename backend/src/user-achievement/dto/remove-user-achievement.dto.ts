import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveUserAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
