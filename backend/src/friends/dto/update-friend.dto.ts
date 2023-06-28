import { IsEnum, IsNumber } from 'class-validator';
import { FriendAction } from '../entities/friend.entity';

export class UpdateFriendDto {
  @IsNumber()
  outgoing_id: number;

  @IsNumber()
  incoming_id: number;

  @IsEnum(FriendAction)
  action: FriendAction;
}
