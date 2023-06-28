import { Message } from './MessageTypes';
import { User } from './UserTypes';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
  DIRECT = 'direct',
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  hash: string;
  channelMembers: User[];
  messages: Message[];
}
