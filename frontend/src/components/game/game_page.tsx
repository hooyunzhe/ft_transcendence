'use client';

import startGame from '@/components/game/game';
import { useEffect, useState } from 'react';
import Pong from './pong';
import { io } from 'socket.io-client';

export default function Game() {
  useEffect(() => {
    startGame(), [window.innerWidth];
  });
  const GameSocket = io(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/gateway/game',
  );
  const triggerOn = () => {
    GameSocket.emit('Start');
  };

  const resetGame = () => {
    GameSocket.emit('Reset');
  };

  const stopGame = () => {
    GameSocket.emit('Stop');
  };

  const InitGame = () => {
    GameSocket.emit('initialize');
  };

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleSubmit = () => {
    const pos = { x, y };
    SetPos(pos);
  };

  const SetPos = (pos: { x: number; y: number }) => {
    GameSocket.emit('set', pos);
  };
  return (
    <div>
      <button onClick={triggerOn}>triggerOn</button>
      <button onClick={resetGame}>Reset</button>
      <button onClick={stopGame}>Stop</button>
      <button onClick={InitGame}>Init</button>
      <form>
        <label>
          x:
          <input
            type='number'
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </label>
        <label>
          y:
          <input
            type='number'
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
          />
        </label>
        <button type='button' onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
