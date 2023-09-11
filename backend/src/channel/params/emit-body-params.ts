import {
  ChannelMember,
  ChannelMemberRole,
  ChannelMemberStatus,
} from 'src/channel-member/entities/channel-member.entity';
import { ChannelType } from '../entities/channel.entity';

export class ChangeChannelNameEmitBodyParams {
  id: number;
  newName: string;
}

export class ChangeChannelTypeEmitBodyParams {
  id: number;
  newType: ChannelType;
  newHash?: string;
}

export class NewMemberEmitBodyParams {
  newMember: ChannelMember;
  adminMember: ChannelMember;
}

export class ChangeChannelMemberRoleEmitBodyParams {
  memberID: number;
  channelID: number;
  newRole: ChannelMemberRole;
}

export class ChangeChannelMemberStatusEmitBodyParams {
  memberID: number;
  userID: number;
  channelID: number;
  newStatus: ChannelMemberStatus;
  mutedUntil?: string;
}

export class EditMessageEmitBodyParams {
  messageID: number;
  channelID: number;
  content: string;
}
