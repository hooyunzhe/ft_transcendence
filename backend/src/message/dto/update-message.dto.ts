import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateMessageDto) =>
      dto.type === undefined || dto.content !== undefined,
  )
  @IsString()
  content: string;

  @ValidateIf(
    (dto: UpdateMessageDto) =>
      dto.content === undefined || dto.type !== undefined,
  )
  @IsEnum(MessageType)
  type: MessageType;
}
