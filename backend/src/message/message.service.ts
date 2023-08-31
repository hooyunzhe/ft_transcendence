import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RemoveMessageDto } from './dto/remove-message.dto';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @Inject(ChannelService)
    private readonly channelService: ChannelService,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(ChannelMemberService)
    private readonly channelMemberService: ChannelMemberService,
  ) {}

  async create(messageDto: CreateMessageDto): Promise<Message> {
    const checkMute = await this.channelMemberService.checkMute(
      messageDto.channel_id,
      messageDto.user_id,
    );

    if (checkMute) {
      throw new ForbiddenException();
    }

    const channelFound = await this.channelService.findOne(
      messageDto.channel_id,
      false,
    );
    const userFound = await this.userService.findOne(messageDto.user_id, false);

    const newMessage = this.messageRepository.create({
      content: messageDto.content,
      type: messageDto.type,
      channel: channelFound,
      user: userFound,
    });

    return await this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findOne(id: number): Promise<Message | null> {
    const found = await this.messageRepository.findOneBy({ id });

    if (!found) {
      throw new EntityNotFoundError(Message, 'id = ' + id);
    }
    return found;
  }

  async findMessagesInChannel(channelID: number): Promise<Message[]> {
    const channelFound = await this.channelService.findOne(channelID, false);

    return await this.messageRepository.find({
      where: { channel: channelFound },
    });
  }

  async findMessagesFromUser(
    channelID: number,
    userID: number,
  ): Promise<Message[]> {
    const channelFound = await this.channelService.findOne(channelID, false);
    const userFound = await this.userService.findOne(userID, false);

    return await this.messageRepository.find({
      where: {
        channel: channelFound,
        // somehow just putting userFound doesn't work??
        // have to specify the id...
        user: { id: userFound.id },
      },
    });
  }

  async update(messageDto: UpdateMessageDto): Promise<void> {
    await this.messageRepository.update(messageDto.id, {
      ...(messageDto.content && { content: messageDto.content }),
      ...(messageDto.type && { type: messageDto.type }),
    });
  }

  async remove(messageDto: RemoveMessageDto): Promise<void> {
    await this.messageRepository.delete(messageDto.id);
  }
}
