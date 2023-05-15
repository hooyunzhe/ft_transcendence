import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelMemberDto } from './dto/create-channel_member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel_member.dto';
import { ChannelMember } from './entities/channel_member.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChannelMembersService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,

    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(channel_id: number, user_id: number): Promise<void> {
    let channel = await this.channelsRepository.findOneBy({ id: channel_id });
    let user = await this.usersRepository.findOneBy({ id: user_id });

    let newChannelMember = this.channelMembersRepository.create({
      channel: channel,
      user: user,
    });
    await this.channelMembersRepository.save(newChannelMember);
  }

  async findAll(): Promise<ChannelMember[]> {
    return await this.channelMembersRepository.find();
  }

  async findOne(id: number): Promise<ChannelMember | null> {
    return await this.channelMembersRepository.findOneBy({ id });
  }

  async getMembers(channel_id: number): Promise<ChannelMember[]> {
    return await this.channelMembersRepository.find({
      relations: {
        user: true,
      },
      where: {
        channel: { id: channel_id },
      },
    });
  }

  async getChannels(user_id: number): Promise<ChannelMember[]> {
    return await this.channelMembersRepository.find({
      relations: {
        channel: true,
      },
      where: {
        user: { id: user_id },
      },
    });
  }

  async update(
    id: number,
    updateChannelMemberDto: UpdateChannelMemberDto,
  ): Promise<void> {
    await this.channelMembersRepository.update(id, updateChannelMemberDto);
  }

  async remove(id: number): Promise<void> {
    await this.channelMembersRepository.delete(id);
  }
}
