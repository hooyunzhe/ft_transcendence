import { ChannelRole, ChannelStatus } from '../entities/channel_user.entity';

export class CreateChannelUserDto {
  channel_id: number;
  user_id: number;
  role: ChannelRole;
  status: ChannelStatus;
}
