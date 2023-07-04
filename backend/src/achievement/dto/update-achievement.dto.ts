import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateAchievementDto) =>
      dto.description === undefined || dto.name !== undefined,
  )
  @IsString()
  name: string;

  @ValidateIf(
    (dto: UpdateAchievementDto) =>
      dto.name === undefined || dto.description !== undefined,
  )
  @IsString()
  description: string;
}
