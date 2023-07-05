import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelMember, ChannelMemberRole, ChannelMemberStatus } from './entities/channel_member.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel_members',
})

export class ChannelMembersGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // client.data.user_id ??= Number(client.handshake.query['id']);
    // client.join(String(client.data.user_id));
    // client.broadcast.emit('newConnection', client.data.user_id);
  }

  handleDisconnect(client: Socket) {
    // client.broadcast.emit('newDisconnect', client.data.user_id);
  }

  @SubscribeMessage('addUser')
  AddUser(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.join(String(data.channel.id));
    client.to([String(data.channel.id), String(client.data.user_id)]).emit('addUser', data);
  }
  @SubscribeMessage('kickUser')
  kickUser(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.leave(String(data.channel.id))
    client.to([String(data.channel.id), String(client.data.user_id)]).emit('kickUser', data);
  }

  @SubscribeMessage('changeRole')
  changeRole(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.to([String(data.channel.id), String(client.data.user_id)]).emit('changeRole', data);
  }

  @SubscribeMessage('changeStatus')
  changeStatus(@MessageBody() data: ChannelMember, @ConnectedSocket() client: Socket) {
    client.to([String(data.channel.id), String(client.data.user_id)]).emit('changeStatus', data);
  }

}
