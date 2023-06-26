import Message from './MessageTypes';
import User from './UserTypes';

export default interface Channel {
  id: number;
  name: string;
  type: string;
  hash: string;
  channelMembers: User[];
  messages: Message[];
}
