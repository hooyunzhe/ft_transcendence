import { Injectable } from '@nestjs/common';
import { Server } from 'http';

interface Coor {
  x: number;
  y: number;
}

class RectObj {
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 1;
    this.velocityY = 1;
  }
  left() {
    return this.x - this.width / 2;
  }

  right() {
    return this.x + this.width / 2;
  }

  top() {
    return this.y - this.height / 2;
  }

  bottom() {
    return this.y + this.height / 2;
  }
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
}
@Injectable()
export class GameService {
  windowSize: Coor;
  direction: Coor;
  Ball: RectObj;
  Paddle1: RectObj;
  Paddle2: RectObj;
  velocity: number;
  i: number = 0;

  constructor() {
    this.windowSize = {
      x: 800,
      y: 600,
    };
    this.direction = {
      x: 0,
      y: 0,
    };
    this.Ball = new RectObj(
      this.windowSize.x / 2,
      this.windowSize.y / 2,
      40,
      40,
    );
    this.Paddle1 = new RectObj(15, this.windowSize.y / 2, 10, 110);
    this.Paddle2 = new RectObj(
      this.windowSize.x - 15,
      this.windowSize.y / 2,
      10,
      110,
    );
    this.velocity = 10;
  }

  gameStart() {
    const heading = Math.random() * Math.PI * 2;
    this.direction = {
      x: Math.cos(heading),
      y: Math.sin(heading),
    };
  }

  gameReset() {
    this.Ball.x = this.windowSize.x / 2;
    this.Ball.y = this.windowSize.y / 2;
    this.Paddle1.y = this.windowSize.y / 2;
    this.Paddle2.y = this.windowSize.y / 2;
    this.direction = {
      x: 0,
      y: 0,
    };
  }

  gameUpdate(server: Server) {
    this.Ball.x += this.direction.x * this.velocity;
    this.Ball.y += this.direction.y * this.velocity;
    if (this.Ball.top() <= 0 || this.Ball.bottom() >= this.windowSize.y)
      this.direction.y *= -1;
    // if (this.Ball.left() <= 0 || this.Ball.right() >= this.windowSize.x) {
    //   this.direction.x *= -1;
    //   console.log(
    //     'ball left:',
    //     this.Ball.left(),
    //     'ball right :',
    //     this.Ball.right(),
    //   );
    // }
    if (this.Ball.right() < 0 || this.Ball.left() > this.windowSize.x)
      this.gameReset();
    if (
      (this.gameCollision(this.Ball, this.Paddle1) && this.direction.x < 0) ||
      (this.gameCollision(this.Ball, this.Paddle2) && this.direction.x > 0)
    ) {
      this.direction.x *= -1;
      console.log('x:', this.Ball.x, ' y:', this.Ball.y);
    }

    // console.log("ball left:",this.Ball.left, " paddle right:",this.Paddle1.right)
    // console.log(this.gameCollision(this.Paddle1, this.Ball));
    server.emit('game', {
      ball: {
        x: this.Ball.x,
        y: this.Ball.y,
      },
      paddle1: { x: this.Paddle1.x, y: this.Paddle1.y },
      paddle2: { x: this.Paddle2.x, y: this.Paddle2.y },
    });
  }

  gameSetPosition(x: number, y: number) {
    this.Ball.x = x;
    this.Ball.y = y;
  }

  gameSetPaddlePosition(player: number, direction: number) {
    if (player === 1) {
      if (direction > 0)
        this.gameMovePaddle(this.Paddle1, 50 * this.Paddle1.velocityY);
      else if (direction < 0)
        this.gameMovePaddle(this.Paddle1, -50 * this.Paddle1.velocityY);
      this.Paddle1.velocityY += 0.5;
    } else if (player === 2) {
      if (direction > 0)
        this.gameMovePaddle(this.Paddle2, 50 * this.Paddle2.velocityY);
      else if (direction < 0)
        this.gameMovePaddle(this.Paddle2, -50 * this.Paddle2.velocityY);
      this.Paddle2.velocityY += 0.5;
    }
  }

  gameSetPaddleStop(player: number) {
    if (player === 1) this.Paddle1.velocityY = 1;
    if (player === 2) this.Paddle2.velocityY = 1;
  }
  gameMovePaddle(obj: RectObj, dir: number) {
    if (obj.top() + dir >= 0 && obj.bottom() + dir <= this.windowSize.y)
      obj.y += dir;
    else if (dir > 0) obj.y = this.windowSize.y - obj.height / 2;
    else if (dir < 0) obj.y = obj.height / 2;
  }
  gameCollision(obj1: RectObj, obj2: RectObj) {
    return (
      obj1.left() <= obj2.right() &&
      obj1.right() >= obj2.left() &&
      obj1.top() <= obj2.bottom() &&
      obj1.bottom() >= obj2.top()
    );
  }
}
