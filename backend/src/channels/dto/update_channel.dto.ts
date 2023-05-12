import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create_channel.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
