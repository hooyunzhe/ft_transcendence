import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/matchmaking',
})
export class MatchmakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private client_list: Socket[] = [];
  async handleConnection(client: Socket) {
    client.data.user_id ??= Number(client.handshake.query['user_id']);
    this.client_list.push(client);
    console.log('client with id: ', client.data.user_id, 'is finding match');
    console.log(this.client_list.length);
    if (this.client_list.length === 2) {
      console.log('event: length == 2, match found');
      await this.handleMatchMaking(this.client_list.splice(0, 2));
    }
  }
  async handleDisconnect(client: Socket) {
    this.client_list = this.client_list.filter((user) => user !== client);
  }

  async handleMatchMaking(clients: Socket[]) {
    const uniquekey = clients[0].id + clients[1].id;
    clients.forEach((client) => {
      client.emit('match', uniquekey);
    });
  }
}
