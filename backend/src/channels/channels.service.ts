import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create_channel.dto';
import { UpdateChannelDto } from './dto/update_channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<void> {
    await this.channelsRepository.save(createChannelDto);
  }

  async addUser(id: number, user_id: number): Promise<void> {
    let currentChannel = await this.channelsRepository.findOneBy({ id });
    let updatedUserChannels = {
      channel_id: id,
      user_id: user_id,
    };
    await this.channelsRepository.update(id, {
      userChannels: [...currentChannel.userChannels, updatedUserChannels],
    });
  }

  async findAll(): Promise<Channel[]> {
    return await this.channelsRepository.find();
  }

  async findOne(id: number): Promise<Channel | null> {
    return await this.channelsRepository.findOneBy({ id });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<void> {
    await this.channelsRepository.update(id, updateChannelDto);
  }

  async remove(id: number): Promise<void> {
    await this.channelsRepository.delete(id);
  }
}
