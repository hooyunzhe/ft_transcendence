'use client';
import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface GameRenderProps {
  gameSocket: Socket;
}

export default function GameRender({ gameSocket }: GameRenderProps) {
  const score = {
    player1: 0,
    player2: 0,
  };

  const ball = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
  const paddle1 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();
  const paddle2 = useRef<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>();

  const keyState: { [key: string]: boolean } = {};
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

  useEffect(() => {
    gameSocket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
      }) => {
        // GameCoordinateProps = ball;
        if (ball.current) {
          ball.current.x = data.ball.x;
          ball.current.y = data.ball.y;
        }
        if (paddle1.current) paddle1.current.y = data.paddle1.y;
        if (paddle2.current) paddle2.current.y = data.paddle2.y;
        // score.player1 = data.score.player1;
        // score.player2 = data.score.player2;
      },
    );

    function setKeyStateFalse(event: KeyboardEvent) {
      keyState[event.key] = false;
    }

    function setKeyStateTrue(event: KeyboardEvent) {
      keyState[event.key] = true;
    }
    window.addEventListener('keyup', setKeyStateFalse, true);

    window.addEventListener('keydown', setKeyStateTrue, true);
    return () => {
      gameSocket.off('game');
      window.removeEventListener('keyup', setKeyStateFalse);
      window.removeEventListener('keydown', setKeyStateTrue);
    };
  }, []);
  // function PositionUpdate() {
  //   if (!ball.current || !paddle1.current || !paddle2.current) return;
  //   ball.current.x = coordinate.ball.x;
  //   ball.current.y = coordinate.ball.y;
  //   paddle1.current.y = coordinate.paddle1;
  //   paddle2.current.y = coordinate.paddle2;
  // }
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

    ball.current = game.physics.add.sprite(400, 300, 'ballsprite', '0.png');
    // if (!ball) return;
    particles.startFollow(ball.current);
    const gameState = game.add.text(400, 50, '', { align: 'center' });
    gameState.setOrigin(0.5);
    paddle1.current = game.physics.add.sprite(15, 300, 'paddle1');
    paddle2.current = game.physics.add.sprite(785, 300, 'paddle2');

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

    ball.current.anims.play('ballPulse', true);

    // useEffect(() => {
    //   gameSocket.on(
    //     'game',
    //     (data: {
    //       ball: { x: number; y: number };
    //       paddle1: { x: number; y: number };
    //       paddle2: { x: number; y: number };
    //       score: { player1: number; player2: number };
    //     }) => {

    //   },
    // );

    //   return () => {
    //     gameSocket.off('game');
    //   };
    // }, []);
  }

  const keyLoop = () => {
    if (keyState['w']) {
      gameSocket.emit('Player', 'w');
    }
    if (keyState['s']) {
      gameSocket.emit('Player', 's');
    }
  };

  function update(this: Phaser.Scene) {
    keyLoop();
  }

  return null;
}
