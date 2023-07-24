import { Channel, ChannelType } from '../entities/channel.entity';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { Message } from 'src/message/entities/message.entity';

export class JoinRoomEmitBodyParams {
  id: number;
}
export class ChangeChannelNameEmitBodyParams {
  id: number;
  newName: string;
}

export class ChangeChannelTypeEmitBodyParams {
  id: number;
  newType: ChannelType;
  newPass?: string;
}

export class ChannelEmitBodyParams {
  Channel: Channel
}

export class ChannelMembersEmitBodyParams {
  ChannelMember: ChannelMember
}

export class MessagesEmitBodyParams {
  messages: Message
}
