'use client';

import startGame from '@/components/game';
import { useEffect } from 'react';
import Pong from '../../components/pong';
import { io } from 'socket.io-client';
import { initialize } from 'next/dist/server/lib/render-server';
export default function Game() {
  useEffect(() => {
    startGame(), [window.innerWidth];
  });
  const GameSocket = io('http://localhost:4242/gateway/game');
  const triggerOn = () => {
    GameSocket.emit('game');
  };
  return( <div><button onClick={triggerOn}>triggerOn</button></div>);
}
