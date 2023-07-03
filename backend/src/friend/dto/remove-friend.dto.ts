import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFriendDto {
  @IsNotEmpty()
  @IsNumber()
  outgoing_id: number;

  @IsNotEmpty()
  @IsNumber()
  incoming_id: number;
}
