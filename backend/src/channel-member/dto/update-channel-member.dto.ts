import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import {
  ChannelMemberRole,
  ChannelMemberStatus,
} from '../entities/channel-member.entity';

export class UpdateChannelMemberDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ValidateIf(
    (dto: UpdateChannelMemberDto) =>
      dto.status === undefined || dto.role !== undefined,
  )
  @IsEnum(ChannelMemberRole)
  role: ChannelMemberRole;

  @ValidateIf(
    (dto: UpdateChannelMemberDto) =>
      dto.role === undefined || dto.status !== undefined,
  )
  @IsEnum(ChannelMemberStatus)
  status: ChannelMemberStatus;

  @ValidateIf(
    (dto: UpdateChannelMemberDto) =>
      dto.status === ChannelMemberStatus.MUTED || dto.muted_until !== undefined,
  )
  @IsDate()
  muted_until: Date;
}
