import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberService } from './channel-member.service';
import { CreateChannelMemberDto } from './dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel-member.dto';
import { RemoveChannelMemberDto } from './dto/remove-channel-member.dto';
import {
  ChannelMemberGetQueryParams,
  ChannelMemberSearchType,
} from './params/get-query-params';

@Controller('channel-members')
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @Post()
  async create(
    @Body() channelMemberDto: CreateChannelMemberDto,
  ): Promise<ChannelMember | null> {
    return this.channelMemberService.create(channelMemberDto);
  }

  @Get()
  async find(@Query() queryParams: ChannelMemberGetQueryParams) {
    switch (queryParams.search_type) {
      case ChannelMemberSearchType.ALL:
        return this.channelMemberService.findAll();
      case ChannelMemberSearchType.ONE:
        return this.channelMemberService.findOne(queryParams.search_number);
      case ChannelMemberSearchType.CHANNEL:
        return this.channelMemberService.findMembersInChannel(
          queryParams.search_number,
        );
      case ChannelMemberSearchType.USER:
        return this.channelMemberService.findChannelsOfUser(
          queryParams.search_number,
        );
      case ChannelMemberSearchType.EXACT:
        return this.channelMemberService.findExact(
          queryParams.search_number,
          queryParams.second_search_number,
        );
    }
  }

  @Patch()
  async update(
    @Body() channelMemberDto: UpdateChannelMemberDto,
  ): Promise<void> {
    this.channelMemberService.update(channelMemberDto);
  }

  @Delete()
  async remove(
    @Body() channelMemberDto: RemoveChannelMemberDto,
  ): Promise<void> {
    this.channelMemberService.remove(channelMemberDto);
  }
}
