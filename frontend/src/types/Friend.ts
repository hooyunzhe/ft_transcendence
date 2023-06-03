import User from './User';

export default interface Friend {
  id: number;
  outgoing_friend: User;
  incoming_friend: User;
  status: string;
}
