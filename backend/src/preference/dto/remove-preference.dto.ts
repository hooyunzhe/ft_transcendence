import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemovePreferenceDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
