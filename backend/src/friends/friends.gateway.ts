import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetStatusDto } from './dto/get-status.dto';
import { Friend } from './entities/friend.entity';

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

  @SubscribeMessage('getStatus')
  async getStatus(@MessageBody() getStatusDto: GetStatusDto) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);
    let statusDictionary: { [key: number]: string } = {};

    getStatusDto.user_ids.forEach((user_id) => {
      statusDictionary[user_id] = onlineUsers.includes(user_id)
        ? 'online'
        : 'offline';
    });
    return statusDictionary;
  }

  @SubscribeMessage('newRequest')
  newRequest(@MessageBody() newRequestDto: Friend) {
    this.server
      .to(String(newRequestDto.outgoing_friend.id))
      .emit('newRequest', newRequestDto);
  }

  @SubscribeMessage('deleteRequest')
  deleteRequest(@MessageBody() deleteRequestDto: Friend) {
    this.server
      .to(String(deleteRequestDto.incoming_friend.id))
      .emit('deleteRequest', deleteRequestDto.outgoing_friend);
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(@MessageBody() acceptRequestDto: Friend) {
    this.server
      .to(String(acceptRequestDto.incoming_friend.id))
      .emit('acceptRequest', acceptRequestDto.outgoing_friend);
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(@MessageBody() rejectRequestDto: Friend) {
    this.server
      .to(String(rejectRequestDto.incoming_friend.id))
      .emit('rejectRequest', rejectRequestDto.outgoing_friend);
  }
}
