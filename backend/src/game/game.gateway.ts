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

  private Ball: Coor = { x: 0.5, y: 0.5 };
  private dir: Coor = { x: 0, y: 0 };

  gameStart() {
    this.Ball = {
      x: 0.5,
      y: 0.5,
    };
    const heading = Math.random() * Math.PI;
    this.dir = {
      x: Math.cos(heading),
      y: Math.sin(heading),
    };
  }
  
  changeDirection() {
    this.dir.x *= -1;
    this.dir.y *= -1;
  }
  
  @Interval(50)
  updateBall() {
    const prevBall = { ...this.Ball };
    this.Ball.x += this.dir.x * 0.01;
    this.Ball.y += this.dir.y * 0.01;

    // console.log("x :", this.Ball.x);
    // console.log("y :", this.Ball.y);

    this.server.emit('game', this.Ball);
    setTimeout(() => this.updateBall(), 50);
  }

  @SubscribeMessage('game')
  startgame(@MessageBody() game: string): void {
    this.gameStart();
    this.updateBall();
    console.log('START!');
  }

  @SubscribeMessage('collide')
  changedir(@MessageBody() game: string): void {
      this.changeDirection();
      console.log('collide!');
  }
}
