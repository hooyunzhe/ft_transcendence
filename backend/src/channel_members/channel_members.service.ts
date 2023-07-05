import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateChannelMemberDto } from './dto/update-channel_member.dto';
import { ChannelMember } from './entities/channel_member.entity';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateChannelMemberDto } from './dto/create-channel_member.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChannelMembersService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,

    @Inject(ChannelsService)
    private readonly channelsService: ChannelsService,

    @Inject(UsersService)
    private readonly usersService: UsersService
  ) { }

  async create(
    createChannelMemberDto: CreateChannelMemberDto,
  ): Promise<ChannelMember | null> {
    if (createChannelMemberDto.pass) {
      const authorized = await this.channelsService.authorize(
        createChannelMemberDto.channel_id,
        createChannelMemberDto.pass,
      );

      if (!authorized) {
        return null;
      }
    }

    const channelFound = await this.channelsService.findOne(createChannelMemberDto.channel_id);

    if (!channelFound) {
      return null;
    }

    const userFound = await this.usersService.findOne(createChannelMemberDto.user_id);

    if (!userFound) {
      return null;
    }

    const newChannelMember = this.channelMembersRepository.create({
      channel: channelFound,
      user: userFound,
      role: createChannelMemberDto.role,
    });
    return await this.channelMembersRepository.save(newChannelMember);
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
