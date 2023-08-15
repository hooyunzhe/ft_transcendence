'use client';

import startGame from '@/components/game/game';
import { useEffect, useState } from 'react';
import Pong from './pong';
import { io } from 'socket.io-client';
import { useGameSocket } from '@/lib/stores/useSocketStore';

export default function Game() {
  useEffect(() => {
    startGame(), [window.innerWidth];
  });
  const gameSocket = useGameSocket();
  if (!gameSocket) {
    return;
  }
  const triggerOn = () => {
    gameSocket.emit('Start');
  };

  const resetGame = () => {
    gameSocket.emit('Reset');
  };

  const stopGame = () => {
    gameSocket.emit('Stop');
  };

  const InitGame = () => {
    gameSocket.emit('initialize');
  };

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleSubmit = () => {
    const pos = { x, y };
    SetPos(pos);
  };

  const SetPos = (pos: { x: number; y: number }) => {
    gameSocket.emit('set', pos);
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
