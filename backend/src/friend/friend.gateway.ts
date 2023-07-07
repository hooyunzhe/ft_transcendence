import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Friend } from './entities/friend.entity';
import { FriendEmitBodyParams } from './params/emit-body-params';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friends',
})
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  async getStatus(@MessageBody() user_ids: number[]) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);
    const statusDictionary: { [key: number]: string } = {};

    user_ids.forEach((user_id) => {
      statusDictionary[user_id] = onlineUsers.includes(user_id)
        ? 'online'
        : 'offline';
    });
    return statusDictionary;
  }

  getIDs(friendship: Friend): string[] {
    return [
      String(friendship.outgoing_friend.id),
      String(friendship.incoming_friend.id),
    ];
  }

  @SubscribeMessage('newRequest')
  newRequest(@MessageBody() newRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(newRequestBodyParams.friendship))
      .emit('newRequest', newRequestBodyParams.friendship);
  }

  @SubscribeMessage('deleteRequest')
  deleteRequest(@MessageBody() deleteRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(deleteRequestBodyParams.friendship))
      .emit(
        'deleteRequest',
        deleteRequestBodyParams.friendship.outgoing_friend,
      );
  }

  @SubscribeMessage('acceptRequest')
  acceptRequest(@MessageBody() acceptRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(acceptRequestBodyParams.friendship))
      .emit(
        'acceptRequest',
        acceptRequestBodyParams.friendship.outgoing_friend,
      );
  }

  @SubscribeMessage('rejectRequest')
  rejectRequest(@MessageBody() rejectRequestBodyParams: FriendEmitBodyParams) {
    this.server
      .to(this.getIDs(rejectRequestBodyParams.friendship))
      .emit(
        'rejectRequest',
        rejectRequestBodyParams.friendship.outgoing_friend,
      );
  }
}
