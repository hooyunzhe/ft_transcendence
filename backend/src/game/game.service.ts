import { Injectable } from '@nestjs/common'
import { Server } from 'http';
import {Engine, Bodies, Body, World, Events} from 'matter-js'


@Injectable()
export class GameService {
	private engine: Engine;
	private world: World;
	private ball: Body;


	constructor()
	{
		this.engine = Engine.create();
		this.world = this.engine.world;
		this.world.bounds = {
			min: {x: 0, y: 0},
			max: {x: 100, y: 100},
		}
		this.ball = Bodies.circle(50, 50, 10,  {
			inertia: 0,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0,
			restitution: 2,
			label: "ball"
	});
		
		const angle = Math.random() * Math.PI * 2;
		Body.setVelocity(this.ball, {x: Math.cos(angle) * 5, y: Math.sin(angle) * 5});
		
		this.engine.gravity.y = 0;
		const bottomWall = Bodies.rectangle(50, 95, 90, 5, { isStatic: true, friction: 0});
		const topWall = Bodies.rectangle(50, 5, 90, 5, { isStatic: true, friction: 0});
		const leftWall = Bodies.rectangle(5, 50, 5, 90, {isStatic: true, friction: 0});
		const rightWall = Bodies.rectangle(95, 50, 5, 90, {isStatic: true, friction: 0});
		World.add(this.world, [this.ball, bottomWall, topWall,leftWall,rightWall]);
	}

	
	UpdateEvent(server: Server)
	{
		Engine.update(this.engine);

		const ballinfo: {x , y} = this.ball.position;
		console.log('Ball position:', ballinfo);
		console.log('Ball velocity:', this.ball.velocity);
		server.emit('game', ballinfo);
	}
}

	