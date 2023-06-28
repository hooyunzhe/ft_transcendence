import { Channel } from './ChannelTypes';
import { User } from './UserTypes';

export enum ChannelMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum ChannelMemberStatus {
  BANNED = 'banned',
  MUTED = 'muted',
}

export interface ChannelMember {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}
