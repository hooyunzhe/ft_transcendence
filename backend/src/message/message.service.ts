import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RemoveMessageDto } from './dto/remove-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @Inject(ChannelService)
    private readonly channelService: ChannelService,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(messageDto: CreateMessageDto): Promise<Message> {
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
      throw new EntityNotFoundError(Message, 'id: ' + id);
    }
    return found;
  }

  async findMessagesInChannel(channel_id: number): Promise<Message[]> {
    const channelFound = await this.channelService.findOne(channel_id, false);

    return await this.messageRepository.find({
      where: { channel: channelFound },
    });
  }

  async findMessagesFromUser(
    channel_id: number,
    user_id: number,
  ): Promise<Message[]> {
    const channelFound = await this.channelService.findOne(channel_id, false);
    const userFound = await this.userService.findOne(user_id, false);

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
