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
import { ChannelMember } from './entities/channel_member.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel_members',
})
export class ChannelMembersGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: ChannelMembersService) { }

  async handleConnection(client: Socket) {
    // client.data.user_id ??= Number(client.handshake.query['id']);
    // client.join(String(client.data.user_id));
    // client.broadcast.emit('newConnection', client.data.user_id);
  }

  handleDisconnect(client: Socket) {
    // client.broadcast.emit('newDisconnect', client.data.user_id);
  }

  @SubscribeMessage('addUser')
  addUser(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    console.log('ADD USER GATEWAY CALLED!');
    client.join(String(data.channel.id));
    client.to([String(data.channel.id), String(data.user.id)]).emit('addUser', data);
    return data;
  }

  @SubscribeMessage('kickUser')
  kickUser(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.to(String(data.channel.id)).emit('kickUser', data);
    return data;
  }

  @SubscribeMessage('changeRole')
  changeRole(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.to(String(data.channel.id)).emit('changeRole', data);
    return data;
  }

}
