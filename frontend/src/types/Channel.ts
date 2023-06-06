import Message from './Message';
import User from './User';

export default interface Channel {
  id: number;
  name: string;
  type: string;
  hash: string;
  channelMembers: User[];
  messages: Message[];
}
