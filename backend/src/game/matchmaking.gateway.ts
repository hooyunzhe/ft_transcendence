import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking.service';
import { GameServer } from 'src/libs/GameServer';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/matchmaking',
})
export class MatchmakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private matchmakingService: MatchmakingService
  constructor() {
    this.matchmakingService = new MatchmakingService();
  }

  @WebSocketServer()
  server: Server

  private client_list: Socket[] = [];
  async handleConnection(client: Socket) {
    if (!client.data.user_id) {
      client.data.user_id ??= Number(client.handshake.query['user_id']);
      this.client_list.push(client);
    }
    console.log('client with id: ', client.data.user_id, 'is finding match');
    console.log('client currently finding match: ', this.client_list.length);
    if (this.client_list.length === 1) {
      console.log('event: length == 1, match found');
      await this.handleMatchMaking(this.client_list.splice(0, 1));
    }
  }

  @SubscribeMessage('check')
  async checkGameStatus(@ConnectedSocket() client: Socket,){
    const players = await this.server.fetchSockets();
    console.log("matchmaking totalconnection:", players.length);
  }
  
  handleMatchMaking(clients: Socket[]) {
    const uniquekey = clients[0].id;
    clients.forEach((client) => {
      client.emit('match', uniquekey);
    });
  }

  async handleDisconnect(client: Socket) {
    this.client_list = this.client_list.filter((user) => user !== client);
  }
}
