import { Injectable } from '@nestjs/common';
import { Server } from 'http';

interface Coor {
  x: number;
  y: number;
}

class RectObj {
	constructor(x: number, y: number, width: number, height: number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
		left(){
			return (this.x - (this.width / 2));
		}

		right(){
			return (this.x +( this.width / 2));
		}

		top(){
			return (this.y -( this.height / 2));
		}

		bottom(){
			return (this.y + (this.height / 2));
		}
		x: number;
		y: number;
		private width: number;
		private height: number;
}
@Injectable()
export class GameService {
		windowSize: Coor;
		direction: Coor;
		Ball: RectObj;
		Paddle1: RectObj;
		Paddle2: RectObj;
		velocity: number;

		constructor()
		{
			this.windowSize = {
				x: 800,
				y: 600,
			}
			this.direction = {
				x: 0,
				y: 0,
			}
			this.Ball = new RectObj(this.windowSize.x /2 , this.windowSize.y /2, 80, 80);
			this.Paddle1 = new RectObj(2, this.windowSize.y / 2, 2, 100);
			this.Paddle2 = new RectObj(this.windowSize.x -2 , this.windowSize.y / 2, 2, 100);
			this.velocity = 0.1;
		}

		gameStart() {
			const heading = Math.random() * Math.PI * 2;
			this.direction = {
				x: Math.cos(heading),
				y: Math.sin(heading),
			};
		}

		gameReset() {
			this.Ball.x = this.windowSize.x /2;
			this.Ball.y = this.windowSize.y /2;
			this.direction = {
				x: 0,
				y: 0,
			};
		}

		gameUpdate(server: Server){
			this.Ball.x += this.direction.x * this.velocity;
			this.Ball.y += this.direction.y * this.velocity;
			if (this.Ball.top() <= 0 || this.Ball.bottom() >= this.windowSize.y)
				this.direction.y *= -1;
			if (this.Ball.left() <= 0 || this.Ball.right() >= this.windowSize.x)
			{
				this.direction.x *= -1;
			}
			// if (this.gameCollision(this.Ball, this.Paddle1) || this.gameCollision(this.Ball, this.Paddle2))
			// {
			// 	this.direction.x *= -1;
			// 	console.log("x:",this.Ball.x, " y:",this.Ball.y)
			// }
			// console.log("ball left:",this.Ball.left, " paddle right:",this.Paddle1.right)
			// console.log(this.gameCollision(this.Paddle1, this.Ball));
			server.emit('game', this.Ball);
			
		}

		gameSetPosition(x: number, y: number)
		{
			this.Ball.x = x;
			this.Ball.y = y;
		}

		gameCollision(obj1: RectObj, obj2: RectObj){
			return (


				obj1.left() <= obj2.right() && 
				obj1.right() >= obj2.left() && 
				obj1.top() <= obj2.bottom() && 
				obj1.bottom() >= obj2.top()
			)
		}
}
