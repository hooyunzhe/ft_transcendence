import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyTwoFactorDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  token: string;
}
