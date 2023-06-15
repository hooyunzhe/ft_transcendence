import Channel from './Channel';

export default interface Message {
  id: number;
  content: string;
  type: string;
  date_of_creation: Date;
  channel: Channel;
}
