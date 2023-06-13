'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import RunGame from '@/components/game';

export default function GamePage() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const gameSocket = io(
    `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game`,
    {
      query: {
        user_id: session?.user?.id,
      },
      autoConnect: false,
    },
  );

  const FindMatch = () => {
    const matchSocket = io(
      `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/matchmaking`,
      {
        query: {
          user_id: session?.user?.id,
        },
      },
    );
    console.log(session?.user?.id);
    matchSocket.on('match', (data: number) => {
      gameSocket.connect();
      gameSocket.emit('join', data);
      setLoaded(true);
      matchSocket.disconnect();
    });
  };

  // console.log(session);
  // // session.data?.user;

  const Start = () => {
    console.log('starting game');
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

  useEffect(() => {
    RunGame(gameSocket);
  }, [loaded]);

  return (
    <div>
      <button onClick={FindMatch}>Find Match</button>
      <button onClick={Start}>Start</button>
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}
