import Channel from './Channel';
import User from './User';

export enum ChannelMemberRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

export enum ChannelMemberStatus {
  Banned = 'banned',
  Muted = 'muted',
  Default = 'default',
}

export default interface ChannelMembers {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}
