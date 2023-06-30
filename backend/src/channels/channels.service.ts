import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from './entities/channel.entity';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async authorize(channel_id: number, pass: string): Promise<boolean> {
    const channel = await this.channelsRepository.findOne({
      where: { id: channel_id },
    });
    return bcrypt.compare(pass, channel.hash);
  }

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    return await this.channelsRepository.save({
      name: createChannelDto.name,
      type: createChannelDto.type,
      hash: createChannelDto.pass
        ? await bcrypt.hash(createChannelDto.pass, 10)
        : '',
    });
  }

  async findAll(): Promise<Channel[]> {
    return await this.channelsRepository.find();
  }

  async findOne(id: number): Promise<Channel | null> {
    return await this.channelsRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Channel | null> {
    return await this.channelsRepository.findOneBy({ name: ILike(name) });
  }

  async getMembers(id: number): Promise<User[]> {
    const currentChannel = await this.channelsRepository.findOne({
      relations: { channelMembers: true },
      where: { id },
    });

    return currentChannel.channelMembers.map(
      (channelMember) => channelMember.user,
    );
  }

  async getMessages(id: number): Promise<Message[]> {
    const currentChannel = await this.channelsRepository.findOne({
      relations: { messages: true },
      where: { id },
    });

    return currentChannel.messages;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<void> {
    await this.channelsRepository.update(id, updateChannelDto);
  }

  async remove(id: number): Promise<void> {
    await this.channelsRepository.delete(id);
  }
}
