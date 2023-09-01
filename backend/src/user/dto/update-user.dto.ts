import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      (dto.username === undefined &&
        dto.refresh_token === undefined &&
        dto.avatar_url === undefined) ||
      dto.intra_id !== undefined,
  )
  @IsString()
  intra_id: string;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      (dto.intra_id === undefined &&
        dto.refresh_token === undefined &&
        dto.avatar_url === undefined) ||
      dto.username !== undefined,
  )
  @IsString()
  username: string;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      (dto.intra_id === undefined &&
        dto.username === undefined &&
        dto.avatar_url === undefined) ||
      dto.refresh_token !== undefined,
  )
  @IsString()
  refresh_token: string;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      (dto.intra_id === undefined &&
        dto.username === undefined &&
        dto.refresh_token === undefined) ||
      dto.avatar_url !== undefined,
  )
  @IsString()
  avatar_url: string;
}
