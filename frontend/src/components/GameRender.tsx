'use client';
import Phaser from 'phaser';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface GameRenderProps {
  gameSocket: Socket;
}

export default function GameRender({ gameSocket }: GameRenderProps) {
  const score = {
    player1: 0,
    player2: 0,
  };
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };
    const gameSession = new Phaser.Game(config);

    return () => {
      gameSession.destroy(true, true);
    };
  }, []);

  function preload(this: Phaser.Scene) {
    const game = this;
    game.load.multiatlas('ballsprite', '/ball/ballsprite.json', 'ball');
    game.load.image('red', '/ball/bubble.png');
    game.load.image('paddle1', '/ball/paddle1.png');
    game.load.image('paddle2', '/ball/paddle2.png');
  }

  function create(this: Phaser.Scene) {
    const game = this;
    const particles = game.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD',
    });

    const ball = game.physics.add.sprite(400, 300, 'ballsprite', '0.png');
    const gameState = game.add.text(400, 50, '', { align: 'center' });
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
      key: 'ballPulse',
      frames: frames,
      frameRate: 60,
      repeat: -1,
    });

    ball.anims.play('ballPulse', true);
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
          score.player1 = data.score.player1;
          score.player2 = data.score.player2;
        },
      );

      return () => {
        gameSocket.off('game');
      };
    }, []);
  }

  const keyLoop = () => {
    if (keyState['w']) {
      gameSocket.emit('Player', 'w');
    }
    if (keyState['s']) {
      gameSocket.emit('Player', 's');
    }
  };
  const keyState: { [key: string]: boolean } = {};

  window.addEventListener(
    'keyup',
    function (e) {
      keyState[e.key] = false;
    },
    true,
  );

  window.addEventListener(
    'keydown',
    function (e) {
      keyState[e.key] = true;
    },
    true,
  );

  function update(this: Phaser.Scene) {
    keyLoop();
  }

  return null;
}
