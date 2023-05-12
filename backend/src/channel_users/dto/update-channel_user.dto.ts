import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelUserDto } from './create-channel_user.dto';

export class UpdateChannelUserDto extends PartialType(CreateChannelUserDto) {}
