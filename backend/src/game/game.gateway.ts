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

  async handleConnection(client: Socket) {
    client.data.user_id ??= Number(client.handshake.query['user_id']);
    client.data.roomid ??= '';
    console.log('HERER');
  }

  async handleDisconnect(client: Socket) {
    await this.roomlist.delete(client.data.roomid);
  }

  @SubscribeMessage('join')
  async createRoom(
    @MessageBody() roomid: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.roomid) {
      client.join(roomid);
      client.data.roomid = roomid;
    }
    if ((await this.server.in(roomid).fetchSockets()).length === 1) {
      console.log('event: create room: ', roomid);
      this.roomlist.set(roomid, new GameService(roomid, this.server));
      console.log(this.roomlist.size);
      // console.log(this.roomlist);
    }
  }

  // Init(
  //   @MessageBody()
  //   data: {
  //     paddle1size: { width: number; height: number };
  //     paddle2size: { width: number; height: number };
  //   },
  // ): void {
  //   this.game.gamePaddleConstruct(data.paddle1size, data.paddle2size);
  //   this.id = setInterval(() => {
  //     this.game.gameUpdate(this.server);
  //     // this.game.resetI();
  //   }, 50);
  // }

  @SubscribeMessage('Start')
  start(@ConnectedSocket() client: Socket) {
    console.log('within start: ', client.data.roomid);
    this.roomlist.get(client.data.roomid).gameStart();
  }

  @SubscribeMessage('Reset')
  reset(@ConnectedSocket() client: Socket) {
    this.roomlist.get(client.data.roomid).gameReset();
  }
  // @SubscribeMessage('Stop')
  // Stop() {
  //   clearInterval(this.id);
  // }

  @SubscribeMessage('Set')
  SetPosition(
    @MessageBody() position: { x: number; y: number },
    @ConnectedSocket() client: Socket,
  ): void {
    this.roomlist[client.data.roomid].gameSetPosition(position.x, position.y);
  }

  @SubscribeMessage('Player')
  MovePaddle(
    @MessageBody() movement: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (movement === 'w')
      this.roomlist[client.data.roomid].gameSetPaddlePosition(1, -1);
    if (movement === 's')
      this.roomlist[client.data.roomid].gameSetPaddlePosition(1, 1);
    if (movement === 'up')
      this.roomlist[client.data.roomid].gameSetPaddlePosition(2, -1);
    if (movement === 'down')
      this.roomlist[client.data.roomid].gameSetPaddlePosition(2, 1);
  }
}
