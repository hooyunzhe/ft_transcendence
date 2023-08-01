import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel, ChannelType } from './entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { RemoveChannelDto } from './dto/remove-channel.dto';
import { ChannelRelation } from './params/get-query-params';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  getRelationsToLoad(loadRelations: boolean): {
    channelMembers: boolean;
    messages: boolean;
  } {
    return {
      channelMembers: loadRelations,
      messages: loadRelations,
    };
  }

  async authorize(id: number, pass: string, hash: string): Promise<boolean> {
    const channel = await this.findOne(id, false);

    if (channel.type === ChannelType.PROTECTED) {
      return (
        (await bcrypt.compare(pass, channel.hash)) || hash === channel.hash
      );
    }
    return true;
  }

  async create(channelDto: CreateChannelDto): Promise<Channel> {
    const channelExists = await this.channelsRepository.findOneBy({
      name: channelDto.name,
    });

    if (channelExists) {
      throw new EntityAlreadyExistsError(
        'Channel',
        'name = ' + channelDto.name,
      );
    }

    return await this.channelsRepository.save({
      name: channelDto.name,
      type: channelDto.type,
      ...(channelDto.type === ChannelType.PROTECTED && {
        hash: await bcrypt.hash(channelDto.pass, 10),
      }),
    });
  }

  async findAll(loadRelations: boolean): Promise<Channel[]> {
    return await this.channelsRepository.find({
      relations: this.getRelationsToLoad(loadRelations),
    });
  }

  async findOne(id: number, loadRelations: boolean): Promise<Channel | null> {
    const found = await this.channelsRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { id },
    });

    if (!found) {
      throw new EntityNotFoundError(Channel, 'id = ' + id);
    }
    return found;
  }

  async findByName(
    name: string,
    loadRelations: boolean,
  ): Promise<Channel | null> {
    const found = await this.channelsRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { name: ILike(name) },
    });

    if (!found) {
      throw new EntityNotFoundError(Channel, 'name = ' + name);
    }
    return found;
  }

  async getRelations(
    id: number,
    relation: ChannelRelation,
  ): Promise<User[] | Message[]> {
    switch (relation) {
      case ChannelRelation.MEMBERS:
        return this.getMembers(id);
      case ChannelRelation.MESSAGES:
        return this.getMessages(id);
    }
  }

  async getMembers(id: number): Promise<User[]> {
    const currentChannel = await this.findOne(id, true);

    return currentChannel.channelMembers.map(
      (channelMember) => channelMember.user,
    );
  }

  async getMessages(id: number): Promise<Message[]> {
    const currentChannel = await this.findOne(id, true);

    return currentChannel.messages;
  }

  async update(channelDto: UpdateChannelDto): Promise<void> {
    const authorized = await this.authorize(
      channelDto.id,
      channelDto.oldPass,
      '',
    );

    if (!authorized) {
      throw new ForbiddenException();
    }

    await this.channelsRepository.update(channelDto.id, {
      ...(channelDto.name && { name: channelDto.name }),
      ...(channelDto.type && { type: channelDto.type }),
      ...(channelDto.pass && { hash: await bcrypt.hash(channelDto.pass, 10) }),
    });
  }

  async remove(channelDto: RemoveChannelDto): Promise<void> {
    await this.channelsRepository.delete(channelDto.id);
  }
}
