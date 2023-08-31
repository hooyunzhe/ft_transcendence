import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import {
  ChannelMember,
  ChannelMemberRole,
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

  async checkMute(channelID: number, userID: number): Promise<boolean> {
    const mutedChannelMember = await this.findExact(channelID, userID);

    if (
      mutedChannelMember.muted_until &&
      mutedChannelMember.muted_until.getTime() >= Date.now()
    ) {
      return true;
    }
    return false;
  }

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

    if (channelMemberDto.role === ChannelMemberRole.OWNER) {
      const members = await this.findMembersInChannel(channelFound.id);
      const channelHasOwner = members.some(
        (member) => member.role === ChannelMemberRole.OWNER,
      );

      if (channelHasOwner) {
        throw new EntityAlreadyExistsError(
          'ChannelMember',
          'channel_id = ' + channelFound.id + ' & channel_role = OWNER',
        );
      }
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

  async findMembersInChannel(channelID: number): Promise<ChannelMember[]> {
    const channelFound = await this.channelService.findOne(channelID, false);

    return await this.channelMemberRepository.findBy({
      channel: { id: channelFound.id },
    });
  }

  async findChannelsOfUser(userID: number): Promise<ChannelMember[]> {
    const userFound = await this.userService.findOne(userID, false);

    return await this.channelMemberRepository.findBy({
      user: { id: userFound.id },
    });
  }

  async findExact(
    channelID: number,
    userID: number,
  ): Promise<ChannelMember | null> {
    const channelFound = await this.channelService.findOne(channelID, false);
    const userFound = await this.userService.findOne(userID, false);

    const found = await this.channelMemberRepository.findOneBy({
      channel: { id: channelFound.id },
      user: { id: userFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(
        ChannelMember,
        'channel_id = ' + channelID + ' & user_id = ' + userID,
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
