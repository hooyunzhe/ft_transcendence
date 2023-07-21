import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveChannelMemberDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
