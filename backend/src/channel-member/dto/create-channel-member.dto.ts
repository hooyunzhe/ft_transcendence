import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChannelMemberRole } from '../entities/channel-member.entity';

export class CreateChannelMemberDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsEnum(ChannelMemberRole)
  role: ChannelMemberRole;

  @IsOptional()
  @IsString()
  pass: string;
}
