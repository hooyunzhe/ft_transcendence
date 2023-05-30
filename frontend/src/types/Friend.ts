import { User } from './User';

export interface Friend {
  id: number;
  outgoing_friend: User;
  incoming_friend: User;
  status: string;
}
