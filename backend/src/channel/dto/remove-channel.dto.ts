import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveChannelDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
