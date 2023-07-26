import {
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
  newPass?: string;
}

export class ChangeChannelMemberRoleEmitBodyParams {
  memberID: number;
  channelID: number;
  newRole: ChannelMemberRole;
}

export class ChangeChannelMemberStatusEmitBodyParams {
  memberID: number;
  channelID: number;
  newStatus: ChannelMemberStatus;
}
