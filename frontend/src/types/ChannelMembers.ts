import Channel from './Channel';
import User from './User';

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

export default interface ChannelMembers {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}
