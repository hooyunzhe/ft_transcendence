import { FriendStatus } from '../entities/friend.entity';

export class CreateFriendDto {
  outgoing_id: number;
  incoming_id: number;
  status: FriendStatus;
}
