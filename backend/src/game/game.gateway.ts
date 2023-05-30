import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { Server } from 'http';

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

  private Ball: Coor = { x: 50, y: 50 };
  private dir: Coor = { x: 0, y: 0 };

  gameStart() {
    const heading = Math.random() * Math.PI;
    this.dir = {
      x: Math.cos(heading),
      y: Math.sin(heading),
    };
  }
  @Interval(50)
  updateBall() {
    const prevBall = { ...this.Ball };
    this.Ball.x += this.dir.x * 10;
    this.Ball.y += this.dir.y * 10;

    if (
      (this.Ball.x >= 100 && this.dir.x >= 0) ||
      (this.Ball.x <= 0 && this.dir.x < 0)
    )
      this.dir.x *= -1;
    if (
      (this.Ball.y >= 100 && this.dir.y >= 0) ||
      (this.Ball.y <= 0 && this.dir.y < 0)
    )
      this.dir.y *= -1;

    // console.log("x :", this.Ball.x);
    // console.log("y :", this.Ball.y);

    this.server.emit('game', this.Ball);
    setTimeout(() => this.updateBall(), 100);
  }

  @SubscribeMessage('game')
  startgame(@MessageBody() game: string): void {
    this.gameStart();
    this.updateBall();
    console.log('START!');
  }
}
