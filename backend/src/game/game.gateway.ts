import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';

import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

interface Coor {
  x: number;
  y: number;
}
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

  async handleConnection(client: Socket) {}

  @SubscribeMessage('init')
  async setup(
    @MessageBody() user_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.user_id ??= user_id;
    client.data.roomid ??= '';
    console.log('user id :', client.data.user_id);
  }
  async handleDisconnect(client: Socket) {
    // Promise.all([
    //   this.roomlist.delete(client.data.roomid),
    //   (client.data.user_id ??= ''),
    //   (client.data.roomid ??= ''),
    // ]);
  }

  @SubscribeMessage('start')
  start(@ConnectedSocket() client: Socket) {
    console.log('within start: ', client.data.roomid);
    this.roomlist.get(client.data.roomid).gameStart();
  }

  @SubscribeMessage('join')
  async createRoom(
    @MessageBody() roomid: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.roomid) {
      client.join(roomid);
      client.data.roomid = roomid;
      console.log(
        'user id: ',
        client.data.user_id,
        'get assigned with room: ',
        roomid,
      );
    }

    const player_in_room = await this.server.in(roomid).fetchSockets();
    console.log('player in thisroom: ', roomid, ': ', player_in_room.length);
    if (player_in_room.length === 2) {
      player_in_room[0].data.player = 1;
      player_in_room[1].data.player = 2;
      console.log('event: createroom: ', roomid);
      this.roomlist.set(roomid, new GameService(roomid, this.server));
      console.log('room size : ', this.roomlist.size);
      // console.log(this.roomlist);
    }
  }

  @SubscribeMessage('reset')
  reset(@ConnectedSocket() client: Socket) {
    console.log('HEHAHSUHDJSJKHASA');
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
}