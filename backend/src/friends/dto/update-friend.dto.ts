import { FriendAction } from '../entities/friend.entity';

export class UpdateFriendDto {
  outgoing_id: number;
  incoming_id: number;
  action: FriendAction;
}
