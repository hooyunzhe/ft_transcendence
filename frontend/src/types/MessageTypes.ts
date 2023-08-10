import { Channel } from './ChannelTypes';
import { User } from './UserTypes';

export enum MessageType {
  TEXT = 'TEXT',
  INVITE = 'INVITE',
  DELETED = 'DELETED',
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  date_of_creation: string;
  last_updated: string;
  channel: Channel;
  user: User;
}
