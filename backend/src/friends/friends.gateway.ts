import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CheckStatusDto } from './dto/check-status.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friends',
})
export class FriendsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    client.data.user_id ??= Number(client.handshake.query['id']);
    client.join(String(client.data.user_id));
    client.broadcast.emit('newConnection', client.data.user_id);
  }

  handleDisconnect(client: Socket) {
    client.broadcast.emit('newDisconnect', client.data.user_id);
  }

  @SubscribeMessage('checkStatus')
  async checkStatus(@MessageBody() checkStatusDto: CheckStatusDto) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);

    return checkStatusDto.user_ids.map((user_id) => ({
      id: user_id,
      online: onlineUsers.includes(user_id),
    }));
  }

  @SubscribeMessage('newRequest')
  newRequest(@MessageBody() newRequestDto: FriendRequestDto) {
    this.server
      .to(String(newRequestDto.receiver.id))
      .emit('newRequest', newRequestDto.sender);
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(@MessageBody() acceptRequestDto: FriendRequestDto) {
    this.server
      .to(String(acceptRequestDto.receiver.id))
      .emit('acceptRequest', acceptRequestDto.sender);
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(@MessageBody() rejectRequestDto: FriendRequestDto) {
    this.server
      .to(String(rejectRequestDto.receiver.id))
      .emit('rejectRequest', rejectRequestDto.sender);
  }
}
