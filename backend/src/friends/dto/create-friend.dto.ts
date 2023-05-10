import { FriendStatus } from '../friends.enum';

export class CreateFriendDto {
  uid_1: string;
  uid_2: string;
  status: FriendStatus;
}
