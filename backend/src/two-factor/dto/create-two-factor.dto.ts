import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTwoFactorDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
