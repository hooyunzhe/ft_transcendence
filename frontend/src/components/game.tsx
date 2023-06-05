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
    this.load.multiatlas('ballsprite', '/ball/ballsprite.json', 'ball');
    this.load.image('red', '/ball/bubble.png');
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
    this.ball = this.physics.add.sprite(400, 300, 'ballsprite', '0.png');
    // this.ball.setBounce(1, 1);
    // this.ball.setCollideWorldBounds(true);
    // this.ball.setVelocityX(100);
    // this.ball.setVelocityY(100);
    this.ball.setScale(1, 1);
    this.paddle1 = this.physics.add.sprite(15, 300, 'paddle1');
    this.paddle2 = this.physics.add.sprite(785, 300, 'paddle1');
    particles.startFollow(this.ball);
    const paddleleft = this.add.graphics();
    const frames = this.anims.generateFrameNames('ballsprite', {
      start: 0,
      end: 215,
      zeroPad: 0,
      suffix: '.png',
    });

    this.anims.create({
      key: 'ballani',
      frames: frames,
      frameRate: 24,
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
        this.paddlecoor1x = data.paddle1.x;
        this.paddlecoor1y = data.paddle1.y;
        this.paddle2.x = data.paddle2.x;
        this.paddle2.y = data.paddle2.y;
      },
    );

    window.addEventListener('keydown', (event) => {
      if (event.key == 'w') this.GameSocket.emit('Player', 'w');
      else if (event.key == 's') this.GameSocket.emit('Player', 's');
    });

    window.addEventListener('keyup', (event) => {
      if (event.key == 'w' || event.key == 's')
        this.GameSocket.emit('Player', '1');
    });

    window.addEventListener('keydown', (event) => {
      if (event.key == 'ArrowUp') this.GameSocket.emit('Player', 'up');
      else if (event.key == 'ArrowDown') this.GameSocket.emit('Player', 'down');
    });

    window.addEventListener('keyup', (event) => {
      if (event.key == 'ArrowUp' || event.key == 'ArrowDown')
        this.GameSocket.emit('Player', '2');
    });
  }

  update() {
    const balltween = this.tweens.add({
      targets: this.ball,
      x: this.targetX,
      y: this.targetY,
      duration: 50, // Adjust the duration as needed for desired smoothness
      ease: 'Linear',
    });

    // Update current position after the tween completes
    balltween.on('complete', () => {
      this.ball.x = this.targetX;
      this.ball.y = this.targetY;
    });

    const paddletween = this.tweens.add({
      targets: this.paddle1,
      x: this.paddlecoor1x,
      y: this.paddlecoor1y,
      duration: 50, // Adjust the duration as needed for desired smoothness
      ease: 'Linear',
    });

    paddletween.on('complete', () => {
      this.paddle1.x = this.paddlecoor1x;
      this.paddle1.y = this.paddlecoor1y;
    });
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
