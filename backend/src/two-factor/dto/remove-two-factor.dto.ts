import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveTwoFactorDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
