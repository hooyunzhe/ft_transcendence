import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelMembersService } from './channel_members.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel_messages',
})
export class ChannelMembersGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: ChannelMembersService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    client.join('temp_channel_id');
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    this.server.to(client.id).emit('Yes', 'printing data');
    return data;
  }

}
