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
import {
  GetStatusEmitBodyParams,
  InitConnectionEmitBodyParams,
} from './params/emit-body-params';
import { UserStatus } from './entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/users',
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
    @MessageBody() initConnectionBodyParams: InitConnectionEmitBodyParams,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id = initConnectionBodyParams.user_id;
    client.join(String(client.data.user_id));
    client.broadcast.emit('newConnection', client.data.user_id);
  }

  @SubscribeMessage('getStatus')
  async getStatus(
    @MessageBody() getStatusEmitBodyParams: GetStatusEmitBodyParams,
  ) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);
    const statusDictionary: { [key: number]: string } = {};

    getStatusEmitBodyParams.user_ids.forEach((user_id) => {
      statusDictionary[user_id] = onlineUsers.includes(user_id)
        ? UserStatus.ONLINE
        : UserStatus.OFFLINE;
    });
    return statusDictionary;
  }
}
