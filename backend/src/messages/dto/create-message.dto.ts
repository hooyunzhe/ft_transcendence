import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  channel_id: number;
  sender_id: number;
  content: string;
  type: MessageType;
}
