'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { Button, ToggleButton } from '@mui/material';
import ConfirmationPrompt from '@/components/ConfirmationPrompt';
import { gameSocket } from '@/lib/socket';
import GameRender from '@/components/game/GameRender';

export default function GamePage() {
  // const [session, setSession] = useState(useSession());
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [searching, setsearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  // const [roomid, setRoomid] = useState('');
  const test = useRef(gameReady);
  const socketRef = useRef();

  useEffect(() => {
    // matchSocket.on('match', (data: string) => {
    //   matchSocket.sendBuffer = [];
    //   setRoomid(data);
    //   setMatchFound(true);
    //   // matchSocket.disconnect();
    // });
    gameSocket.on('match', () => {
      setMatchFound(true);
    }),
      gameSocket.on('disc', () => {
        gameSocket.disconnect();
      });
    gameSocket.on('connect', () => {
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', session?.user?.id);
    });
    gameSocket.on('disconnect', () => {
      gameSocket.sendBuffer = [];
      console.log('game socket disconnected');
      setsearching(false);
      setMatchFound(false);
      setGameReady(false);
    });
    return () => {
      gameSocket.off('connect');
      gameSocket.off('disconnect');
      gameSocket.off('match');
      gameSocket.off('disc');
    };
  }, []);

  const findMatch = () => {
    gameSocket.connect();
    setsearching(true);
  };

  // const CheckStatus = () => {
  //   matchSocket.emit('check');
  // };
  // console.log(session);
  // // session.data?.user;

  const startGame = () => {
    // if (gameSocket.disconnected) gameSocket.connect();
    // console.log('Starting game');
    // console.log(gameSocket.connected);
    gameSocket.emit('ready');
    test.current = !test.current;
  };

  // const joinGame = () => {
  //   console.log('Joinin game');
  //   gameSocket.emit('join');
  //   setMatchFound(false);
  // };

  // const rejectGame = () => {
  //   gameSocket.emit('reject');
  //   setMatchFound(false);
  // };

  const disconnectGame = () => {
    gameSocket.disconnect();
    setsearching(false);
  };

  const resetGame = () => {
    gameSocket.emit('reset');
    setGameReady(false);
    gameSocket.disconnect();
    // setRoomid('');
  };

  return (
    <div>
      <ToggleButton value={searching} onChange={findMatch} disabled={searching}>
        Find Match
      </ToggleButton>
      {/* <Button onClick={CheckStatus}>Check Status </Button> */}
      <ToggleButton
        value={matchFound}
        onChange={startGame}
        disabled={!matchFound}
      >
        {test.current ? 'Unready' : 'Ready'}
      </ToggleButton>
      {/* <ConfirmationPrompt
        open={matchFound}
        onCloseHandler={rejectGame}
        promptTitle={'Match Found!'}
        promptDescription={'Accept this match?'}
        actionHandler={joinGame}
      ></ConfirmationPrompt> */}
      <ToggleButton
        value={test.current}
        onChange={resetGame}
        disabled={!test.current}
      >
        Reset
      </ToggleButton>
      <Button onClick={disconnectGame}>Disconnect</Button>
      <div>
        <GameRender gameSocket={gameSocket} gameReady={test}></GameRender>
      </div>
    </div>
  );
}
