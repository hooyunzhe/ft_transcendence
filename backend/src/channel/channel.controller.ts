import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { ChannelService } from './channel.service';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { RemoveChannelDto } from './dto/remove-channel.dto';
import {
  ChannelGetQueryParams,
  ChannelSearchType,
} from './params/get-query-params';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async create(@Body() channelDto: CreateChannelDto): Promise<Channel> {
    return this.channelService.create(channelDto);
  }

  @Get()
  async find(
    @Query() queryParams: ChannelGetQueryParams,
  ): Promise<User[] | Message[] | Channel[] | Channel | null> {
    switch (queryParams.search_type) {
      case ChannelSearchType.ALL:
        return this.channelService.findAll(queryParams.load_relations);
      case ChannelSearchType.ONE:
        return this.channelService.findOne(
          queryParams.search_number,
          queryParams.load_relations,
        );
      case ChannelSearchType.NAME:
        return this.channelService.findByName(
          queryParams.search_string,
          queryParams.load_relations,
        );
      case ChannelSearchType.RELATION:
        return this.channelService.getRelations(
          queryParams.search_number,
          queryParams.search_relation,
        );
    }
  }

  @Patch()
  async update(@Body() channelDto: UpdateChannelDto): Promise<void> {
    this.channelService.update(channelDto);
  }

  @Delete()
  async remove(@Body() channelDto: RemoveChannelDto): Promise<void> {
    this.channelService.remove(channelDto);
  }
}
