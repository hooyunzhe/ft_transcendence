'use client';
import { gameSocket } from '@/lib/socket';
import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';


export default function GameRender(gameSocket: Socket) {

    useEffect(() => { 
    const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
      scene: {
        preload: preload,
        create: create,
        update: update
    },}
    const gameSession = new Phaser.Game(config);
    return () => {
      gameSession.destroy(true, true);
    }
  },[]);

  function preload(game: Phaser.Scene) {
    game.load.multiatlas('ballsprite', '/ball/ballsprite.json', 'ball');
    game.load.image('red', '/ball/bubble.png');
    game.load.image('paddle1', '/ball/paddle1.png');
    game.load.image('paddle2', '/ball/paddle2.png');
  }

  function create(game: Phaser.Scene) {
    const particles = game.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD',
    });

    const ball = game.physics.add.sprite(400, 300, 'ballsprite', '0.png');
    const gameState = game.add.text(400, 50, '', { align: 'center' });
    // console.log(game.score.player1, game.score.player2);
    gameState.setOrigin(0.5);
    ball.setScale(1, 1);
    const paddle1 = game.physics.add.sprite(15, 300, 'paddle2');
    const paddle2 = game.physics.add.sprite(785, 300, 'paddle1');
    particles.startFollow(ball);
    const frames = game.anims.generateFrameNames('ballsprite', {
      start: 0,
      end: 215,
      zeroPad: 0,
      suffix: '.png',
    });

    game.anims.create({
      key: 'ballani',
      frames: frames,
      frameRate: 60,
      repeat: -1,
    });



    ball.anims.play('ballani', true);
    useEffect(() => {
      gameSocket.on(
        'game',
        (data: {
          ball: { x: number; y: number };
          paddle1: { x: number; y: number };
          paddle2: { x: number; y: number };
          score: { player1: number; player2: number };
        }) => {
          ball.x = data.ball.x;
          ball.y = data.ball.y;
          paddle1.y = data.paddle1.y;
          paddle2.y = data.paddle2.y;
          // score.player1 = data.score.player1;
          // score.player2 = data.score.player2;
        },
      );

      
      return (() => {
        gameSocket.off('game');
      })
    }, [])

  }

  const keyLoop = () => {
    if (keyState['w']) {
      gameSocket.emit('Player', 'w');
    }
    if (keyState['s']) {
      gameSocket.emit('Player', 's');
    }
  };

window.addEventListener(
  'keyup',
  function (e) {
    keyState[e.key] = false;
  },
  true,
);

const keyState: { [key: string]: boolean } = {};
window.addEventListener(
  'keydown',
  function (e) {
    keyState[e.key] = true;
  },
  true,
);


  function update(game: Phaser.Scene) {
    keyLoop();
    // game.gameState.setText(
    //   'Player 1: ' +
    //     this.score.player1 +
    //     ' | ' +
    //     'Player 2: ' +
    //     this.score.player2,
    // );
  }

  return null;
}

 function Game(gameSocket: Socket) {
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
      // this.load.setBaseURL(`http://${process.env.NEXT_PUBLIC_HOST_URL}:3000');
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
      this.keyLoop();
      this.gameState.setText(
        'Player 1: ' +
          this.score.player1 +
          ' | ' +
          'Player 2: ' +
          this.score.player2,
      );
      // }
    }

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
      // arcade: {
      //   gravity: false,
      // },
    },
    fps: {
      target: 60,
    },
    scene: Example,
  };

  const game = new Phaser.Game(config);
}
