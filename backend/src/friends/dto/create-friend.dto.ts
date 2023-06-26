import { FriendStatus } from "../entities/friend.entity";

export class CreateFriendDto {
  user1_id: number;
  user2_id: number;
  status: FriendStatus;
}
