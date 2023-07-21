import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;
}
