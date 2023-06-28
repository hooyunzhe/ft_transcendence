import { Sprite, Stage, useTick } from '@pixi/react';
import Render from './Render';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import AssetLoader from './AssetLoader';
import * as PIXI from 'pixi.js';

interface GameEngineProps {
  gameSocket: Socket;
}
export default function GameEngine({ gameSocket }: GameEngineProps) {
  const [ball, setBall] = useState({ x: 50, y: 50 });
  const paddle1Ref = useRef({ x: 50, y: 50 });
  const paddle2Ref = useRef({ x: 50, y: 50 });
  const paddle1SpriteRef = useRef<PIXI.Sprite>(null);
  useEffect(() => {
    setInterval(() => {
      keyLoop();
    }, 25);
    AssetLoader();
    gameSocket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
      }) => {
        setBall(data.ball);
        if (!paddle1SpriteRef.current) return;
        paddle1SpriteRef.current.position = data.paddle1;
        // paddle1Ref.current = data.paddle1;
        // paddle2Ref.current = data.paddle2;
      },
    );

    return () => {
      gameSocket.off('game');
    };
  }, []);
  const keyLoop = () => {
    // console.log(Date.now());
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

  // useTick(keyLoop);
  return (
    <>
      <Sprite
        ref={paddle1SpriteRef}
        image={'/ball/paddle1.png'}
        anchor={0.5}
        // position={paddle1Ref.current}
      />

      <Sprite
        image={'/ball/paddle2.png'}
        anchor={0.5}
        position={paddle2Ref.current}
      ></Sprite>
    </>
  );
}
