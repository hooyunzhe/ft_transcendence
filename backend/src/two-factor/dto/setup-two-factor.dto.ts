import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetupTwoFactorDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  secret_key: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
