import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { Message } from './entities/message.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/messages',
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    client.join('temp_channel_id');
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('id') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log('Received Test from client!');
    console.log(`You are sending to ${client.id}`);
    this.server.to(client.id).emit('Yes', 'printing data');
    return data;
  }

  @SubscribeMessage('typing')
  userTyping(
    @MessageBody() isTyping: boolean,
    @ConnectedSocket()
    client: Socket,
  ): string {
    const name = this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing');
    console.log(`You are sending to ${client.id}`);
    // this.server.to(client.id).emit('typing', isTyping);
    return 'message received';
  }

  @SubscribeMessage('newMessage')
  sendMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('Received Sent message from client!');
    console.log(`You are sending to ${client.id}`);
    this.server.to('temp_channel_id').emit('newMessage', data);
    return 'message received';
  }
}
