import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { create } from 'domain';
import { CreateMessageDto } from './dto/create-message.dto';
import { find } from 'rxjs';
import { TypedEventEmitter } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  create(@MessageBody() CreateMessageDto: CreateMessageDto) {
    return this.messagesService.create(CreateMessageDto);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom() {
    // Code goes here
  }

  @SubscribeMessage('typing')
  async typing() {
    // code goes here}
  }
}
