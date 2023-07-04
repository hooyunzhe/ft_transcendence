import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class UpdateChannelDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateChannelDto) =>
      (dto.type === undefined && dto.pass === undefined) ||
      dto.name !== undefined,
  )
  @IsString()
  name: string;

  @ValidateIf(
    (dto: UpdateChannelDto) =>
      (dto.name === undefined && dto.pass === undefined) ||
      dto.type !== undefined,
  )
  @IsEnum(ChannelType)
  type: ChannelType;

  @ValidateIf(
    (dto: UpdateChannelDto) =>
      (dto.name === undefined && dto.type === undefined) ||
      dto.pass !== undefined,
  )
  @IsString()
  pass: string;
}
