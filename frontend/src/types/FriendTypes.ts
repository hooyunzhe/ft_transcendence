import User from "./UserTypes";

export enum FriendAction {
  ACCEPT = 'accept',
  REJECT = 'reject',
  REMOVE = 'remove',
  BLOCK = 'block',
  UNBLOCK = 'unblock',
  UNFRIEND = 'unfriend',
}

export enum FriendStatus {
  Friends = 'friends',
  Invited = 'invited',
  Pending = 'pending',
  Blocked = 'blocked',
}

export interface Friend {
  id: number;
  outgoing_friend: User;
  incoming_friend: User;
  status: FriendStatus;
}