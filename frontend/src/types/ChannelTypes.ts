import { ChannelMember } from './ChannelMemberTypes';
import { Message } from './MessageTypes';

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
  date_of_creation: string;
  last_updated: string;
  channelMembers: ChannelMember[];
  messages: Message[];
}
