import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePreferenceDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
