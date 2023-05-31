'use client';
import Phaser, { Scene } from 'phaser';
import { io } from 'socket.io-client';
class Example extends Phaser.Scene {
  constructor() {
    super();
    
  }

  private dog: { key: string }[] = [];
  private ball: Phaser.Physics.Arcade.Sprite;
  private targetX: number = -1;
  private targetY: number = -1;
  private interpolationFactor: number = 0.1; // Controls the smoothness of movement
  private GameSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
  preload() {
    this.load.setBaseURL('http://localhost:3000');
    for (let i = 0; i < 25; i++) {
      this.load.image('ball' + i, '/ball/' + i + '.png');
      this.dog.push({ key: 'ball' + i });
    }
  }

  create() {
    const particles = this.add.particles(0, 0, 'ball2', {
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD',
    });
  
    this.ball = this.physics.add.sprite(0.5 * window.innerWidth, 0.5 * window.innerHeight, 'ball0');
    // this.ball.setBounce(1, 1);
    // this.ball.setCollideWorldBounds(true);
    this.ball.setScale(0.3, 0.3);
    particles.startFollow(this.ball);
  
    this.anims.create({
      key: 'ballani',
      frames: this.dog,
      frameRate: 60,
      repeat: -1,
    });
  
    this.ball.anims.play('ballani', true);
  
    this.GameSocket = io('http://localhost:4242/gateway/game');
   
    
    const bodysize: {width: number, height: number} = {
      width: (this.ball.body?.width ?? 0) / 800,
      height: (this.ball.body?.height ?? 0) / 600,
    }

    console.log("width is :", this.ball.width, ", body width: ", bodysize.width);
    console.log("height is :",this.ball.height, ", body height: ", bodysize.height);
    this.GameSocket.emit("initialize", (bodysize));
    this.GameSocket.on("game", (data: { x: number, y: number }) => {
      this.targetX = (data.x /100 )* window.innerWidth;
      this.targetY = (data.y /100) * window.innerHeight;
      console.log(data.x);
      console.log(data.y);
    });
  
  }
  

  update() {
    if (this.targetX !== -1 && this.targetY !== -1) {
      const deltaX = this.targetX - this.ball.x;
      const deltaY = this.targetY - this.ball.y;
      const interpolatedX = Phaser.Math.Interpolation.SmoothStep(0.1, 0, deltaX);
      const interpolatedY = Phaser.Math.Interpolation.SmoothStep(0.1, 0, deltaY);
      this.ball.x += interpolatedX;
      this.ball.y += interpolatedY;
    }
  }
}

const startGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
      },
    },
    fps: {
      target: 30
    },
    scene: Example,
  };

  const game = new Phaser.Game(config);

  return null;
};

export default startGame;