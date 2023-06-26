'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { ToggleButton } from '@mui/material';
import ConfirmationPrompt from '@/components/ConfirmationPrompt';
import { gameSocket } from '@/lib/socket';
import GameRender from '@/components/GameRender';

export default function GamePage() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [searching, setsearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomid, setRoomid] = useState('');
  // const gameSocket = io(
  //   `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game`,
  //   {
  //     query: {
  //       user_id: session?.user?.id,
  //     },
  //     autoConnect: false,
  //   },
  // );
  // const socketRef = useRef();
  // socketRef.current = gameSocket;
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
      setsearching(true);
    });

    matchSocket.on('match', (data: string) => {
      matchSocket.sendBuffer = [];
      setRoomid(data);
      setMatchFound(true);
      matchSocket.disconnect();
    });

    gameSocket.on('connect', () => {
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', session?.user?.id);
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
    if (gameSocket.disconnected) gameSocket.connect();
    console.log('Starting game');
    console.log(gameSocket.connected);
    gameSocket.emit('start');
    setGameStarted(true);
  };

  const joinGame = () => {
    console.log('Joinin game', roomid);
    gameSocket.connect();
    gameSocket.emit('join', roomid);
    setMatchFound(false);
  };

  const resetGame = () => {
    gameSocket.emit('reset');
    setGameStarted(false);
    gameSocket.disconnect();
    setRoomid('');
  };

  // useEffect(() => {
  //   if (!gameSocket.connected) gameSocket.connect();
  //   RunGame(gameSocket);
  // }, []);

  return (
    <div>
      <ToggleButton value={searching} onChange={findMatch} disabled={searching}>
        Find Match
      </ToggleButton>
      <ToggleButton
        value={searching}
        onChange={startGame}
        disabled={!searching}
      >
        Start
      </ToggleButton>
      <ConfirmationPrompt
        open={matchFound}
        onCloseHandler={() => {
          setMatchFound(false);
        }}
        promptTitle={'Match Found!'}
        promptDescription={'Accept this match?'}
        actionHandler={joinGame}
      ></ConfirmationPrompt>
      <ToggleButton
        value={gameStarted}
        onChange={resetGame}
        disabled={!gameStarted}
      >
        Reset
      </ToggleButton>
      <div>
        <GameRender gameSocket={gameSocket} />
      </div>
    </div>
  );
}
