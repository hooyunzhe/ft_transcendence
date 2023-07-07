import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FriendAction } from '../entities/friend.entity';

export class UpdateFriendDto {
  @IsNotEmpty()
  @IsNumber()
  outgoing_id: number;

  @IsNotEmpty()
  @IsNumber()
  incoming_id: number;

  @IsNotEmpty()
  @IsEnum(FriendAction)
  action: FriendAction;
}
