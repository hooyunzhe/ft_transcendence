import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { RemoteSocket, Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'gateway/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private roomlist = new Map<string, GameService>();

  async handleConnection(client: Socket) {
    client.data.roomid ??= '';
  }

  @SubscribeMessage('init')
  async setup(
    @MessageBody() user_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id ??= user_id;
    client.data.ready = false;
    client.join(client.data.roomid);
    console.log('user id:', client.data.user_id);
    const client_list = await this.fetchPlayer('');
    if (client_list.length >= 2) this.matchMaking(client_list.splice(0, 2));
  }
  async handleDisconnect(client: Socket) {
    this.server.to(client.data.roomid).emit('disc');
    this.roomlist.delete(client.data.roomid);
  }

  async matchMaking(clients: RemoteSocket<DefaultEventsMap, any>[]) {
    const uniquekey = clients[0].id + clients[1].id;
    clients.forEach((client) => {
      client.data.roomid = uniquekey;
      client.leave('');
      client.join(uniquekey);
      client.emit('match');
    });
    console.log(
      'client found a match, joining room:',
      clients[0].rooms + clients[1].id,
    );
    clients[0].data.player = 1;
    clients[1].data.player = 2;
    console.log('event: createroom: ', uniquekey);
    this.roomlist.set(uniquekey, new GameService(uniquekey, this.server));
    console.log('room size : ', this.roomlist.size);
  }

  @SubscribeMessage('ready')
  async start(@ConnectedSocket() client: Socket) {
    const players = await this.fetchPlayer(client.data.roomid);
    if (players.length != 2) return;
    client.data.ready = !client.data.ready;
    console.log('within start: ', client.data.roomid);
    // if (players.re)
    // this.roomlist.get(client.data.roomid).gameStart();
  }

  @SubscribeMessage('join')
  async createRoom(@ConnectedSocket() client: Socket) {
    if (client.data.roomid != '') {
      client.join(client.data.roomid);
      console.log(
        'user id: ',
        client.data.user_id,
        'get assigned with room: ',
        client.data.roomid,
      );
    }

    const player_in_room = await this.fetchPlayer(client.data.roomid);
    console.log(
      'player in thisroom: ',
      client.data.roomid,
      ': ',
      player_in_room.length,
    );
    if (player_in_room.length === 2) {
      player_in_room[0].data.player = 1;
      player_in_room[1].data.player = 2;
      console.log('event: createroom: ', client.data.roomid);
      this.roomlist.set(
        client.data.roomid,
        new GameService(client.data.roomid, this.server),
      );
      console.log('room size : ', this.roomlist.size);
    }
  }
  @SubscribeMessage('check')
  async checkGameStatus(@ConnectedSocket() client: Socket) {
    const players = await this.server.fetchSockets();
    console.log('game server totalconnection:', players.length);
  }

  @SubscribeMessage('reset')
  reset(@ConnectedSocket() client: Socket) {
    this.roomlist.get(client.data.roomid).gameReset();
  }

  @SubscribeMessage('Set')
  SetPosition(
    @MessageBody() position: { x: number; y: number },
    @ConnectedSocket() client: Socket,
  ): void {
    this.roomlist
      .get(client.data.roomid)
      .gameSetPosition(position.x, position.y);
  }

  @SubscribeMessage('Player')
  MovePaddle(
    @MessageBody() movement: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (movement === 'w')
      this.roomlist
        .get(client.data.roomid)
        .gameSetPaddlePosition(client.data.player, -1);
    if (movement === 's')
      this.roomlist
        .get(client.data.roomid)
        .gameSetPaddlePosition(client.data.player, 1);
  }

  @SubscribeMessage('end')
  gameEnd() {}
  async fetchPlayer(roomid: string) {
    return this.server.in(roomid).fetchSockets();
  }

  async fetchPlayerCount(roomid: string) {
    return (await this.fetchPlayer(roomid)).length;
  }
}
