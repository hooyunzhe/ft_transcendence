import { Container } from '@mui/material';
import {
  AnimatedSprite,
  Sprite,
  Stage,
  createRoot,
  useTick,
} from '@pixi/react';
import { Asset } from 'next/font/google';
import { Application, Assets, Point, Spritesheet, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import AssetLoader from './AssetLoader';
import GameEngine from './GameEngine';

interface GameRenderProps {
  gameSocket: Socket;
}

export default function GameRender({ gameSocket }: GameRenderProps) {
  const [textures, setTextures] = useState<Texture[]>([]);
  // const [ball, setBall] = useState({ x: 50, y: 50 });
  // const [paddle1, setPaddle1] = useState({ x: 50, y: 50 });
  // const [paddle2, setPaddle2] = useState({ x: 50, y: 50 });
  // useEffect(() => {
  //   AssetLoader();
  //   gameSocket.on(
  //     'game',
  //     (data: {
  //       ball: { x: number; y: number };
  //       paddle1: { x: number; y: number };
  //       paddle2: { x: number; y: number };
  //       score: { player1: number; player2: number };
  //     }) => {
  //       setBall(data.ball);
  //       setPaddle1(data.paddle1);
  //       setPaddle2(data.paddle2);
  //     },
  //   );

  //   return () => {
  //     gameSocket.off('game');
  //   };
  // }, []);
  // const keyLoop = () => {
  //   if (keyState['w']) {
  //     gameSocket.emit('Player', 'w');
  //   }
  //   if (keyState['s']) {
  //     gameSocket.emit('Player', 's');
  //   }
  // };

  // window.addEventListener(
  //   'keyup',
  //   function (e) {
  //     keyState[e.key] = false;
  //   },
  //   true,
  // );

  // const keyState: { [key: string]: boolean } = {};
  // window.addEventListener(
  //   'keydown',
  //   function (e) {
  //     keyState[e.key] = true;
  //   },
  //   true,
  // );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Stage width={800} height={600}>
        <GameEngine gameSocket={gameSocket} />
        {/* <AnimatedSprite isPlaying={true} animationSpeed={0.5} textures={textures}  initialFrame={0}></AnimatedSprite> */}
      </Stage>
    </div>
  );
}
