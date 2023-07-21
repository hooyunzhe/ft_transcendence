import { Channel } from './ChannelTypes';

export interface Message {
  id: number;
  content: string;
  type: string;
  date_of_creation: Date;
  channel: Channel;
}
