import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @ValidateIf((dto: CreateChannelDto) => dto.type === ChannelType.PROTECTED)
  @IsNotEmpty()
  @IsString()
  pass: string;
}
