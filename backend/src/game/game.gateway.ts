import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'http';
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
export class GameGateway {
  @WebSocketServer()
  server: Server;

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
