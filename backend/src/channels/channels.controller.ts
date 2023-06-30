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
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { User } from 'src/user/entities/user.entity';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll(): Promise<Channel[]> {
    return this.channelsService.findAll();
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string): Promise<Channel | null> {
    return this.channelsService.findOneByName(name);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Channel | null> {
    return this.channelsService.findOne(id);
  }

  @Get(':id/members')
  getMembers(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return this.channelsService.getMembers(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<void> {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.channelsService.remove(id);
  }
}
