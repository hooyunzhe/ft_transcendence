import { User } from './UserTypes';

export enum FriendAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  REMOVE = 'REMOVE',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  UNFRIEND = 'UNFRIEND',
}

export enum FriendStatus {
  FRIENDS = 'FRIENDS',
  INVITED = 'INVITED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export interface Friend {
  id: number;
  outgoing_friend: User;
  incoming_friend: User;
  status: FriendStatus;
}
