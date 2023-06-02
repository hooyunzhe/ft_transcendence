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
  game = new GameService();
  @SubscribeMessage('initialize')
  Init() {
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
    if (movement === '1') this.game.gameSetPaddleStop(1);
    if (movement === '2') this.game.gameSetPaddleStop(2);
  }
}
