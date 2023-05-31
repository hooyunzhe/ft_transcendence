import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { Server } from 'http';
import { Engine, World, Bodies } from 'matter-js';

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
  private Size: Coor = {x: 0, y: 0};

  gameStart() {
 
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

  gamereset() {
    this.Ball = {
      x: 0.5,
      y: 0.5,
    };
    
    this.dir = {
      x: 0,
      y: 0,
    };
  }
  
  @Interval(50)
  updateBall() {
    if (((this.Ball.x) <= 0 && this.dir.x < 0) || ((this.Ball.x)>= 1 && this.dir.x >= 0))
      this.dir.x *= -1;
    if (((this.Ball.y )<= 0 && this.dir.y < 0) || (this.Ball.y >= 1 && this.dir.y >= 0))
      this.dir.y *= -1;
    const prevBall = { ...this.Ball };
    this.Ball.x += this.dir.x * 0.01;
    this.Ball.y += this.dir.y * 0.01;
  

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

  @SubscribeMessage('reset')
  reset(@MessageBody() game: string): void {
      this.gamereset();
  }

  @SubscribeMessage('initialize')
  init(@MessageBody() bodysize: {width: number, height: number}): void {
      this.Size = {
        x: bodysize.width,
        y: bodysize.height,
      }
      console.log("INITIALIZED"); 
  }
}
