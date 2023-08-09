import { Channel } from './ChannelTypes';
import { User } from './UserTypes';

export enum ChannelMemberMuteDuration {
  NONE = 'NONE',
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  DAY = 'DAY',
  LIFETIME = 'LIFETIME',
}

export enum ChannelMemberAction {
  ADMIN = 'ADMIN',
  UNADMIN = 'UNADMIN',
  BAN = 'BAN',
  UNBAN = 'UNBAN',
  MUTE = 'MUTE',
  UNMUTE = 'UNMUTE',
  CHOWN = 'CHOWN',
  KICK = 'KICK',
}

export enum ChannelMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum ChannelMemberStatus {
  BANNED = 'BANNED',
  MUTED = 'MUTED',
  DEFAULT = 'DEFAULT',
}

export interface ChannelMember {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  date_of_creation: string;
  last_updated: string;
  channel: Channel;
  user: User;
}
