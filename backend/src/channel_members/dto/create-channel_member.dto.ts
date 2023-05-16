import {
  ChannelMemberRole,
  ChannelMemberStatus,
} from '../entities/channel_member.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateChannelMemberDto {
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}
