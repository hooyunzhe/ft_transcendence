import { gameSocket } from '@/lib/socket';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

export default function GameCoordinate() {
  let ball = { x: 0, y: 0 };
  let paddle1 = 0;
  let paddle2 = 0;
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
        ball = data.ball;
        paddle1 = data.paddle1.y;
        paddle2 = data.paddle2.y;
        // score.player1 = data.score.player1;
        // score.player2 = data.score.player2;
      },
    );

    return () => {
      gameSocket.off('game');
    };
  }, []);

  return { ball, paddle1, paddle2 };
}
