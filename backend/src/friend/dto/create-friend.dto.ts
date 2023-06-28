import { IsNumber } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  outgoing_id: number;

  @IsNumber()
  incoming_id: number;
}
