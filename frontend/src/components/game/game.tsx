'use client';
import { gameSocket } from '@/lib/socket';
import Phaser, { Scene } from 'phaser';
class Example extends Phaser.Scene {
  constructor() {
    super();
  }
  private ball: Phaser.Physics.Arcade.Sprite;
  private targetX: number = -1;
  private targetY: number = -1;
  private score = { player1: 0, player2: 0 };
  private paddle1: Phaser.Physics.Arcade.Sprite;
  private paddle2: Phaser.Physics.Arcade.Sprite;
  private gameState;
  preload() {
    this.load.setBaseURL(process.env.NEXT_PUBLIC_HOST_URL + ':3000');
    this.load.multiatlas('ballsprite', '/ball/ballsprite.json', 'ball');
    this.load.image('red', '/ball/bubble.png');
    this.load.image('paddle1', '/ball/paddle1.png');
    this.load.image('paddle2', '/ball/paddle2.png');
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

    this.gameState = this.add.text(400, 50, '', { align: 'center' });
    console.log(this.score.player1, this.score.player2);
    this.gameState.setOrigin(0.5);
    this.ball.setScale(1, 1);
    this.paddle1 = this.physics.add.sprite(15, 300, 'paddle2');
    this.paddle2 = this.physics.add.sprite(785, 300, 'paddle1');
    particles.startFollow(this.ball);
    const frames = this.anims.generateFrameNames('ballsprite', {
      start: 0,
      end: 215,
      zeroPad: 0,
      suffix: '.png',
    });

    this.anims.create({
      key: 'ballani',
      frames: frames,
      frameRate: 60,
      repeat: -1,
    });

    this.ball.anims.play('ballani', true);

    // console.log(
    //   'width is :',
    //   this.ball.width,
    //   ', body width: ',
    //   bodysize.width,
    // );
    // console.log(
    //   'height is :',
    //   this.ball.height,
    //   ', body height: ',
    //   bodysize.height,
    // );

    gameSocket.emit('initialize', {
      paddle1size: { width: this.paddle1.width, height: this.paddle1.height },
      paddle2size: { width: this.paddle2.width, height: this.paddle2.height },
    });
    gameSocket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
      }) => {
        this.ball.x = data.ball.x;
        this.ball.y = data.ball.y;
        this.paddle1.y = data.paddle1.y;
        this.paddle2.y = data.paddle2.y;
        this.score.player1 = data.score.player1;
        this.score.player2 = data.score.player2;
      },
    );
  }

  update() {
    // const balltween = this.tweens.add({
    //   targets: this.ball,
    //   x: this.targetX,
    //   y: this.targetY,
    //   duration: 50, // Adjust the duration as needed for desired smoothness
    //   ease: 'Linear',
    // });

    // // Update current position after the tween completes
    // balltween.on('complete', () => {
    //   this.ball.x = this.targetX;
    //   this.ball.y = this.targetY;
    // });

    keyLoop();
    this.gameState.setText(
      'Player 1: ' +
        this.score.player1 +
        ' | ' +
        'Player 2: ' +
        this.score.player2,
    );
    // }
  }
}
const keyState: { [key: string]: boolean } = {};
window.addEventListener(
  'keydown',
  function (e) {
    keyState[e.key] = true;
  },
  true,
);
window.addEventListener(
  'keyup',
  function (e) {
    keyState[e.key] = false;
  },
  true,
);
const keyLoop = () => {
  if (keyState['w']) {
    gameSocket.emit('Player', 'w');
  }
  if (keyState['s']) {
    gameSocket.emit('Player', 's');
  }
  if (keyState['i']) {
    gameSocket.emit('Player', 'up');
  }
  if (keyState['k']) {
    gameSocket.emit('Player', 'down');
  }
};
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
