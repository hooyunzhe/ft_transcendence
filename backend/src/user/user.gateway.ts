import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserStatus } from './entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/user',
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('socketConnected');
  }

  handleDisconnect(client: Socket) {
    client.broadcast.emit('newDisconnect', client.data.user_id);
  }

  @SubscribeMessage('initConnection')
  initConnection(
    @MessageBody() user_id: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id = user_id;
    client.join(String(client.data.user_id));
    client.broadcast.emit('newConnection', client.data.user_id);
  }

  @SubscribeMessage('joinGame')
  joinGame(@ConnectedSocket() client: Socket) {
    client.broadcast.emit('joinGame', client.data.user_id);
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@ConnectedSocket() client: Socket) {
    client.broadcast.emit('leaveGame', client.data.user_id);
  }

  @SubscribeMessage('getStatus')
  async getStatus(@MessageBody() user_ids: number[]) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);
    const statusDictionary: { [key: number]: string } = {};

    user_ids.forEach((user_id) => {
      statusDictionary[user_id] = onlineUsers.includes(user_id)
        ? UserStatus.ONLINE
        : UserStatus.OFFLINE;
    });
    return statusDictionary;
  }
}
