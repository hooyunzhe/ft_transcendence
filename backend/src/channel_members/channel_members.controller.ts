import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateChannelMemberDto } from './dto/create-channel_member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel_member.dto';
import { ChannelMember } from './entities/channel_member.entity';
import { ChannelMembersService } from './channel_members.service';

@Controller('channel_members')
export class ChannelMembersController {
  constructor(private readonly channelMembersService: ChannelMembersService) {}

  @Post()
  create(
    @Body() createChannelMemberDto: CreateChannelMemberDto,
  ): Promise<ChannelMember | null> {
    return this.channelMembersService.create(createChannelMemberDto);
  }

  @Get()
  findAll(): Promise<ChannelMember[]> {
    return this.channelMembersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelMember | null> {
    return this.channelMembersService.findOne(id);
  }

  @Get('channel/:id')
  getMembers(@Param('id', ParseIntPipe) id: number): Promise<ChannelMember[]> {
    return this.channelMembersService.getMembers(id);
  }

  @Get('member/:id')
  getChannels(@Param('id', ParseIntPipe) id: number): Promise<ChannelMember[]> {
    return this.channelMembersService.getChannels(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelMemberDto: UpdateChannelMemberDto,
  ): Promise<void> {
    return this.channelMembersService.update(+id, updateChannelMemberDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.channelMembersService.remove(+id);
  }
}
