import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChannelMember } from "./entities/channel-member.entity";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/channel',
})
export class ChannelMemberGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  @SubscribeMessage('newUser')
  newUser(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket){
    client.join(String(data.channel.id));
    client.to([String(data.channel.id), String(data.user.id)]);
    client.emit('newUser', data);
  }

  @SubscribeMessage('kickUser')
  kickUser(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket,){
    client.leave(String(data.channel.id))
    client.to(String(data.channel.id)).emit('kickUser', data);
  }

  @SubscribeMessage('changeRole')
  changeRole(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket,){
    client.to(String(data.channel.id)).emit('changeRole', data);
  }

  @SubscribeMessage('changeRole')
  changeStatus(@MessageBody() data: ChannelMember,
  @ConnectedSocket() client: Socket,){
    client.to(String(data.channel.id)).emit('changeStatus', data);
  }
}