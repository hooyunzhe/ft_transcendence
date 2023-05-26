import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  channel_id: number;
  user_id: number;
  content: string;
  type: MessageType;
}
