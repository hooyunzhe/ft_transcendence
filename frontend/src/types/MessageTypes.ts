import { Channel } from './ChannelTypes';
import { User } from './UserTypes';

export enum MessageType {
  TEXT = 'TEXT',
  INVITE = 'INVITE',
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  date_of_creation: Date;
  channel: Channel;
  user: User;
}
