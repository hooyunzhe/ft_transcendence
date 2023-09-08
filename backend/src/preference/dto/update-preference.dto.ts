import { IsBoolean, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class UpdatePreferenceDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.sound_effects_enabled === undefined &&
        dto.animations_enabled === undefined) ||
      dto.music_enabled !== undefined,
  )
  @IsBoolean()
  music_enabled: boolean;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.music_enabled === undefined &&
        dto.animations_enabled === undefined) ||
      dto.music_enabled !== undefined,
  )
  @IsBoolean()
  sound_effects_enabled: boolean;

  @ValidateIf(
    (dto: UpdatePreferenceDto) =>
      (dto.music_enabled === undefined &&
        dto.sound_effects_enabled === undefined) ||
      dto.animations_enabled !== undefined,
  )
  @IsBoolean()
  animations_enabled: boolean;
}
