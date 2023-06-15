'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import RunGame from '@/components/game';
import { ToggleButton } from '@mui/material';

export default function GamePage() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [matching, setMatching] = useState(false);
  const [GameStarted, setGameStarted] = useState(false);
  const gameSocket = io(
    `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game`,
    {
      query: {
        user_id: session?.user?.id,
      },
      autoConnect: false,
    },
  );

  const matchSocket = io(
    `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/matchmaking`,
    {
      query: {
        user_id: session?.user?.id,
      },
      autoConnect: false,
    },
  );

  useEffect(() => {
    matchSocket.on('connect', () => {
      matchSocket.sendBuffer = [];
      setMatching(true);
    });

    matchSocket.on('match', (data: number) => {
      matchSocket.sendBuffer = [];
      gameSocket.connect();
      gameSocket.emit('join', data);
      setLoaded(true);
      matchSocket.disconnect();
    });

    gameSocket.on('connect', () => {
      gameSocket.sendBuffer = [];
      console.log('game socket connected');
      gameSocket.emit('start');
    });
    gameSocket.on('disconnect', () => {
      gameSocket.sendBuffer = [];
      console.log('game socket disconnected');
    });

    return () => {
      matchSocket.off('connect');
      matchSocket.off('match');
      gameSocket.off('connect');
      gameSocket.off('disconnect');
    };
  }, []);

  const findMatch = () => {
    matchSocket.connect();
  };

  // console.log(session);
  // // session.data?.user;

  const startGame = () => {
    console.log('Starting game');
    console.log(gameSocket.connected);
    gameSocket.emit('start');
    setGameStarted(true);
  };

  const resetGame = () => {
    gameSocket.emit('reset');
    setGameStarted(false);
    gameSocket.disconnect();
  };

  useEffect(() => {
    RunGame(gameSocket);
  }, [loaded]);

  return (
    <div>
      <ToggleButton value={matching} onChange={findMatch} disabled={matching}>
        Find Match
      </ToggleButton>
      <ToggleButton value={matching} onChange={startGame} disabled={!matching}>
        Start
      </ToggleButton>
      {/* <ToggleButton
        value={GameStarted}
        onChange={resetGame}
        disabled={!GameStarted}
      >
        Reset
      </ToggleButton> */}
    </div>
  );
}
