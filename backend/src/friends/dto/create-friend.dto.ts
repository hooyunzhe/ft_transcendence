import { FriendStatus } from "../entities/friend.entity";


export class CreateFriendDto {
  p1_uid: number;
  p2_uid: number;
  status: FriendStatus;
}
