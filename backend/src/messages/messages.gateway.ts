import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { Message } from './entities/message.entity';
import { IoAdapter } from '@nestjs/platform-socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/messages',
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.messagesService.create(createMessageDto);
    console.log('hi');

    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('id') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing', { name, isTyping });
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log('Received Test from client!');
    console.log(`You are sending to ${client.id}`);
    this.server.to(client.id).emit('Yes', 'printing data');
    return data;
  }

  @SubscribeMessage('sendmessage')
  sendMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('Received Sent message from client!');
    console.log(`You are sending to ${client.id}`);
    this.server.to(client.id).emit('Yes', 'printing data');
    return data;
  }
}
