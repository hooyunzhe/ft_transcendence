import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/friends',
})
export class FriendsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  connectedUsers = new Set();

  handleConnection(client: Socket) {
    const user_id = Number(client.handshake.query['id']);
    this.connectedUsers.add(user_id);
    client.broadcast.emit('newConnection', user_id);
  }

  handleDisconnect(client: Socket) {
    const user_id = Number(client.handshake.query['id']);
    this.connectedUsers.delete(user_id);
    client.broadcast.emit('newDisconnect', user_id);
  }

  @SubscribeMessage('checkStatus')
  checkStatus(@MessageBody('users') users: number[]) {
    const statuses = users.map((user) => ({
      user_id: user,
      connected: this.connectedUsers.has(user),
    }));

    return statuses;
  }
}
