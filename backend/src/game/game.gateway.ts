import {
  MessageBody,
  OnGatewayConnection,
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
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // join room
  // put in a room
  // emit to both
  //matchmaking room -> find match ->

  private client_id_list = new Map();
  async handleConnection(client: Socket) {
    client.data.user_id ??= Number(client.handshake.query['user_id']);
    const connectedSockets = await this.server.fetchSockets();
    const onlineUsers = connectedSockets.map((socket) => socket.data.user_id);
    if (onlineUsers.length === 2) {
      onlineUsers[0].join('room1');
      onlineUsers[1].join('room1');
    }
  }

  private id;
  private game = new GameService();

  @SubscribeMessage('initialize')
  Init(
    @MessageBody()
    data: {
      paddle1size: { width: number; height: number };
      paddle2size: { width: number; height: number };
    },
  ): void {
    this.game.gamePaddleConstruct(data.paddle1size, data.paddle2size);
    this.id = setInterval(() => {
      this.game.gameUpdate(this.server);
      // this.game.resetI();
    }, 50);
  }

  @SubscribeMessage('Start')
  start() {
    this.game.gameStart();
  }

  @SubscribeMessage('Reset')
  reset() {
    this.game.gameReset();
  }

  @SubscribeMessage('Stop')
  Stop() {
    clearInterval(this.id);
  }

  @SubscribeMessage('Set')
  SetPosition(@MessageBody() position: { x: number; y: number }): void {
    this.game.gameSetPosition(position.x, position.y);
  }

  @SubscribeMessage('Player')
  MovePaddle(@MessageBody() movement: string): void {
    if (movement === 'w') this.game.gameSetPaddlePosition(1, -1);
    if (movement === 's') this.game.gameSetPaddlePosition(1, 1);
    if (movement === 'up') this.game.gameSetPaddlePosition(2, -1);
    if (movement === 'down') this.game.gameSetPaddlePosition(2, 1);
  }
}
