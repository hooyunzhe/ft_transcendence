import { ChannelMemberRole } from '../entities/channel_member.entity';

export class CreateChannelMemberDto {
  channel_id: number;
  user_id: number;
  role: ChannelMemberRole;
  pass: string;
}
