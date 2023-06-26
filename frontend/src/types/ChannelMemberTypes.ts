import Channel from './ChannelTypes';
import User from './UserTypes';


export enum ChannelMemberAction {
  ADMIN = 'ADMIN',
  UNADMIN = 'UNADMIN',
  BAN = 'BAN',
  UNBAN = 'UNBAN',
  MUTE = 'MUTE',
  UNMUTE ='UNMUTE',
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

export default interface ChannelMembers {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}
