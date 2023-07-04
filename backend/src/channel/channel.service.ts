import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from './entities/channel.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { RemoveChannelDto } from './dto/remove-channel.dto';
import { ChannelRelation } from './params/get-query-params';

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

  async authorize(id: number, pass: string): Promise<boolean> {
    const channel = await this.findOne(id, false);
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
      throw new EntityNotFoundError(Channel, 'id: ' + id);
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
      throw new EntityNotFoundError(Channel, 'name: ' + name);
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
