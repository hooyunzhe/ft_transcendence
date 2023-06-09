import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import {
  ChannelMember,
  ChannelMemberStatus,
} from './entities/channel-member.entity';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { CreateChannelMemberDto } from './dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel-member.dto';
import { RemoveChannelMemberDto } from './dto/remove-channel-member.dto';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class ChannelMemberService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,

    @Inject(ChannelService)
    private readonly channelService: ChannelService,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(
    channelMemberDto: CreateChannelMemberDto,
  ): Promise<ChannelMember | null> {
    const authorized = await this.channelService.authorize(
      channelMemberDto.channel_id,
      channelMemberDto.pass ?? '',
      channelMemberDto.hash ?? '',
    );

    if (!authorized) {
      throw new ForbiddenException();
    }

    const channelFound = await this.channelService.findOne(
      channelMemberDto.channel_id,
      false,
    );
    const userFound = await this.userService.findOne(
      channelMemberDto.user_id,
      false,
    );

    const userInChannel = await this.channelMemberRepository.findOneBy({
      channel: { id: channelFound.id },
      user: { id: userFound.id },
    });

    if (userInChannel) {
      throw new EntityAlreadyExistsError(
        'ChannelMember',
        'channel_id = ' + channelFound.id + ' & user_id = ' + userFound.id,
      );
    }

    const newChannelMember = this.channelMemberRepository.create({
      channel: channelFound,
      user: userFound,
      role: channelMemberDto.role,
    });
    return await this.channelMemberRepository.save(newChannelMember);
  }

  async findAll(): Promise<ChannelMember[]> {
    return await this.channelMemberRepository.find();
  }

  async findOne(id: number): Promise<ChannelMember | null> {
    const found = await this.channelMemberRepository.findOneBy({ id });

    if (!found) {
      throw new EntityNotFoundError(ChannelMember, 'id = ' + id);
    }
    return found;
  }

  async findMembersInChannel(channel_id: number): Promise<ChannelMember[]> {
    const channelFound = await this.channelService.findOne(channel_id, false);

    return await this.channelMemberRepository.find({
      where: { channel: channelFound },
    });
  }

  async findChannelsOfUser(user_id: number): Promise<ChannelMember[]> {
    const userFound = await this.userService.findOne(user_id, false);

    return await this.channelMemberRepository.find({
      where: { user: { id: userFound.id } },
    });
  }

  async findExact(
    channel_id: number,
    user_id: number,
  ): Promise<ChannelMember | null> {
    const channelFound = await this.channelService.findOne(channel_id, false);
    const userFound = await this.userService.findOne(user_id, false);

    const found = await this.channelMemberRepository.findOneBy({
      channel: { id: channelFound.id },
      user: { id: userFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(
        ChannelMember,
        'channel_id = ' + channel_id + ' & user_id = ' + user_id,
      );
    }
    return found;
  }

  async update(channelMemberDto: UpdateChannelMemberDto): Promise<void> {
    await this.channelMemberRepository.update(channelMemberDto.id, {
      ...(channelMemberDto.role && { role: channelMemberDto.role }),
      ...(channelMemberDto.status && { status: channelMemberDto.status }),
      ...(channelMemberDto.status === ChannelMemberStatus.MUTED && {
        muted_until: channelMemberDto.muted_until,
      }),
      ...(channelMemberDto.status === ChannelMemberStatus.DEFAULT && {
        muted_until: null,
      }),
    });
  }

  async remove(channelMemberDto: RemoveChannelMemberDto): Promise<void> {
    await this.channelMemberRepository.delete(channelMemberDto.id);
  }
}
