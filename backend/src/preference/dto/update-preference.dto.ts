import { IsBoolean, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class UpdatePreferenceDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.animations_enabled === undefined &&
        dto.light_mode_enabled === undefined) ||
      dto.music_enabled !== undefined,
  )
  @IsBoolean()
  music_enabled: boolean;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.music_enabled === undefined &&
        dto.light_mode_enabled === undefined) ||
      dto.animations_enabled !== undefined,
  )
  @IsBoolean()
  animations_enabled: boolean;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.music_enabled === undefined &&
        dto.animations_enabled === undefined) ||
      dto.light_mode_enabled !== undefined,
  )
  @IsBoolean()
  light_mode_enabled: boolean;
}