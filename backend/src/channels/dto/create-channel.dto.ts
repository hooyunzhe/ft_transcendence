import { ChannelType } from '../entities/channel.entity';

export class CreateChannelDto {
  name: string;
  type: ChannelType;
  pass: string;
}
