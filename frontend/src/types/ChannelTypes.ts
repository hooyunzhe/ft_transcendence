import { Message } from './MessageTypes';
import { User } from './UserTypes';

export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  DIRECT = 'DIRECT',
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  hash: string;
  channelMembers: User[];
  messages: Message[];
}
