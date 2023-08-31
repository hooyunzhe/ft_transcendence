import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  intra_id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;

  @IsNotEmpty()
  @IsString()
  avatar_url: string;
}
