import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create_user.dto';

@Injectable()
export class MessagesService {
  clientToUser = [];

  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async create(createMessageDto: CreateMessageDto): Promise<void> {
    let channel = await this.channelsRepository.findOneBy({
      id: createMessageDto.channel_id,
    });

    let user = await this.userRepository.findOneBy({
      id: createMessageDto.user_id,
    });

    let newMessage = this.messagesRepository.create({
      ...createMessageDto,
      user: user,
      channel: channel,
    });

    await this.messagesRepository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  async findOne(id: number): Promise<Message | null> {
    return await this.messagesRepository.findOneBy({ id });
  }

  async getMessages(
    channel_id: number,
    user_id: number,
  ): Promise<Message[] | Message | null> {
    if (user_id === 0) {
      return this.getMessagesInChannel(channel_id);
    } else {
      return this.getMessagesFromUser(channel_id, user_id);
    }
  }

  async getMessagesInChannel(channel_id: number): Promise<Message[]> {
    return this.messagesRepository.findBy({ channel: { id: channel_id } });
  }

  async getMessagesFromUser(
    channel_id: number,
    user_id: number,
  ): Promise<Message[]> {
    return this.messagesRepository.findBy({
      user: { id: user_id },
      channel: { id: channel_id },
    });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<void> {
    await this.messagesRepository.update(id, updateMessageDto);
  }

  async remove(id: number): Promise<void> {
    await this.messagesRepository.delete({ id });
  }
}
