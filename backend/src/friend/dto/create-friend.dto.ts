import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  @IsNumber()
  outgoing_id: number;

  @IsNotEmpty()
  @IsNumber()
  incoming_id: number;
}
