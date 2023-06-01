'use client';

import startGame from '@/components/game';
import { useEffect } from 'react';
import Pong from '../../components/pong';
import { io } from 'socket.io-client';

export default function Game() {
  useEffect(() => {
    startGame(), [window.innerWidth];
  });
  const GameSocket = io('http://localhost:4242/gateway/game');
  const triggerOn = () => {
    GameSocket.emit('Start');
  };

  const resetGame = () => {
    GameSocket.emit('Reset');
  }

  const stopGame = () => {
    GameSocket.emit('Stop');
  }

  const InitGame = () => {
    GameSocket.emit('initialize');
  }
  return( <div><button onClick={triggerOn}>triggerOn</button>
  <button onClick={resetGame}>Reset</button>
  <button onClick={stopGame}>Stop</button>
  <button onClick={InitGame}>Init</button></div>);
}
