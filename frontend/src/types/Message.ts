import { Channel } from './Channel';
import { User } from './User';

export interface Message {
  id: number;
  content: string;
  type: string;
  date_of_creation: Date;
  channel: Channel;
  user: User;
}
