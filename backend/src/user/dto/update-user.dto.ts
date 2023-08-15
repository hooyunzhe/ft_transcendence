import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      dto.refresh_token === undefined ||
      dto.avatar_url === undefined ||
      dto.username !== undefined,
  )
  @IsString()
  username: string;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      dto.username === undefined ||
      dto.avatar_url === undefined ||
      dto.refresh_token !== undefined,
  )
  @IsString()
  refresh_token: string;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      dto.username === undefined ||
      dto.refresh_token === undefined ||
      dto.avatar_url !== undefined,
  )
  @IsString()
  avatar_url: string;
}
