'use client';

import startGame from '@/components/game';
import { useEffect, useState } from 'react';
import Pong from '../../components/pong';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { start } from 'repl';

export default function Game() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const gameSocket = io('http://localhost:4242/gateway/game', {
    query: {
      user_id: session?.user?.id,
    },
    autoConnect: false,
  });

  const FindMatch = () => {
    const matchSocket = io('http://localhost:4242/gateway/matchmaking', {
      query: {
        user_id: session?.user?.id,
      },
    });
    matchSocket.on('match', (data: number) => {
      gameSocket.connect();
      gameSocket.emit('join', data);
    });
  };

  // console.log(session);
  // // session.data?.user;

  useEffect(() => {
    startGame();
  }, []);

  const Start = () => {
    gameSocket.emit('Start');
  };

  const resetGame = () => {
    gameSocket.emit('Reset');
  };

  // const stopGame = () => {
  //   gameSocket.emit('Stop');
  // };

  // const InitGame = () => {
  //   gameSocket.emit('initialize');
  // };

  return (
    <div>
      <button onClick={FindMatch}>Find Match</button>
      <button onClick={Start}>Start</button>
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}
