import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type UserSocket = Socket & { user_id: number };

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

  async handleConnection(client: UserSocket) {
    const user_id = Number(client.handshake.query['id']);
    // this.connectedUsers.add(user_id);
    client.user_id = user_id;
    client.broadcast.emit('newConnection', user_id);
    const sockets = await this.server.fetchSockets();
    console.log(sockets.length);
  }

  handleDisconnect(client: UserSocket) {
    const user_id = Number(client.handshake.query['id']);
    // this.connectedUsers.delete(user_id);
    client.user_id = user_id;
    client.broadcast.emit('newDisconnect', user_id);
  }

  @SubscribeMessage('checkStatus')
  checkStatus(@MessageBody('users') users: number[]) {
    const statuses = users.map((user) => ({
      user_id: user,
      connected: false,
    }));

    return statuses;
  }
}
