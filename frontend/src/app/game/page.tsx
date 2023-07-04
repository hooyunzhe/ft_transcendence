'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { Button, ToggleButton } from '@mui/material';
import ConfirmationPrompt from '@/components/ConfirmationPrompt';
import { gameSocket, matchSocket } from '@/lib/socket';

export default function GamePage() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [searching, setsearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomid, setRoomid] = useState('');

  const socketRef = useRef();
 
  useEffect(() => {
    matchSocket.on('connect', () => {
      matchSocket.sendBuffer = [];
      setsearching(true);
    });

    matchSocket.on('match', (data: string) => {
      matchSocket.sendBuffer = [];
      setRoomid(data);
      setMatchFound(true);
      // matchSocket.disconnect();
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


  const CheckStatus = () => {
    matchSocket.emit('check');
  }
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


  return (
    <div>
      <ToggleButton value={searching} onChange={findMatch} disabled={searching}>
        Find Match
      </ToggleButton>
      <Button onClick={CheckStatus}>Check Status </Button>
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
    // </div>
  );
}
