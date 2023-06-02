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

  private paddlecoor1x: number = 0;
  private paddlecoor1y: number = 0;

  private paddle1: Phaser.Physics.Arcade.Sprite;
  private paddle2: Phaser.Physics.Arcade.Sprite;
  private interpolationFactor: number = 0.1; // Controls the smoothness of movement
  private GameSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
  preload() {
    this.load.setBaseURL('http://localhost:3000');
    this.load.multiatlas('ballsprite', '/newball/spritesheet.json', 'newball');
    this.load.image('red', '/ball/0.png');
    this.load.image('paddle1', '/ball/paddle1.png');
  }

  create() {
    const particles = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD',
    });

    // const graphics = this.add.graphics();

    // const borderWidth = 4; // Border width
    // const borderColor = 0xffffff; // Border color (white)

    // function drawWindowBorder() {
    //   const { width, height } = this.sys.game.canvas;
    //   const x = borderWidth / 2; // X-coordinate of the window (offset by half of the border width)
    //   const y = borderWidth / 2; // Y-coordinate of the window (offset by half of the border width)

    //   // Clear previous drawings
    //   graphics.clear();

    //   // Draw the border
    //   graphics.lineStyle(borderWidth, borderColor);
    //   graphics.strokeRect(x, y, width - borderWidth, height - borderWidth);
    // }
    // drawWindowBorder.call(this); // Initial draw

    // Redraw the border on window resize
    // this.scale.on('resize', drawWindowBorder, this);
    this.ball = this.physics.add.sprite(0, 0, 'ballsprite', '1.png');
    // this.ball.setBounce(1, 1);
    // this.ball.setCollideWorldBounds(true);
    // this.ball.setVelocityX(100);
    // this.ball.setVelocityY(100);
    this.ball.setScale(0.5, 0.5);
    this.paddle1 = this.physics.add.sprite(15, 300, 'paddle1');
    this.paddle2 = this.physics.add.sprite(785, 300, 'paddle1');
    particles.startFollow(this.ball);
    const paddleleft = this.add.graphics();
    const frames = this.anims.generateFrameNames('ballsprite', {
      start: 1,
      end: 48,
      zeroPad: 0,
      suffix: '.png',
    });

    this.anims.create({
      key: 'ballani',
      frames: frames,
      frameRate: 60,
      duration: 50,
      repeat: -1,
    });

    this.ball.anims.play('ballani', true);

    this.GameSocket = io('http://localhost:4242/gateway/game');

    const bodysize: { width: number; height: number } = {
      width: (this.ball.body?.width ?? 0) / 800,
      height: (this.ball.body?.height ?? 0) / 600,
    };

    console.log(
      'width is :',
      this.ball.width,
      ', body width: ',
      bodysize.width,
    );
    console.log(
      'height is :',
      this.ball.height,
      ', body height: ',
      bodysize.height,
    );
    this.GameSocket.emit('initialize');
    this.GameSocket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
      }) => {
        this.targetX = data.ball.x;
        this.targetY = data.ball.y;
        this.paddle1.x = data.paddle1.x;
        this.paddle1.y = data.paddle1.y;
        this.paddle2.x = data.paddle2.x;
        this.paddle2.y = data.paddle2.y;
      },
    );

    window.addEventListener('keydown', (event) => {
      if (event.key == 'w') this.GameSocket.emit('Player', 'w');
      else if (event.key == 's') this.GameSocket.emit('Player', 's');
    });

    window.addEventListener('keydown', (event) => {
      if (event.key == 'ArrowUp') this.GameSocket.emit('Player', 'up');
      else if (event.key == 'ArrowDown') this.GameSocket.emit('Player', 'down');
    });
  }

  update() {
    // if (this.targetX !== -1 && this.targetY !== -1) {
    //   const deltaX = this.targetX - this.ball.x;
    //   const deltaY = this.targetY - this.ball.y;
    //   const interpolatedX = Phaser.Math.Interpolation.SmoothStep(
    //     0.1,
    //     0,
    //     deltaX,
    //   );
    //   const interpolatedY = Phaser.Math.Interpolation.SmoothStep(
    //     0.1,
    //     0,
    //     deltaY,
    //   );
    this.ball.x = this.targetX;
    this.ball.y = this.targetY;

    // }
  }
}

const startGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
      },
    },
    fps: {
      target: 60,
    },
    scene: Example,
  };

  const game = new Phaser.Game(config);

  return null;
};

export default startGame;
