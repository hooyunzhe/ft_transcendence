'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Button } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import GameRender from '@/components/game/GameRender';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';

export default function GameMenu() {
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameAction = useGameActions();
  const userId = useCurrentUser();
  const { displayConfirmation } = useConfirmationActions();

  useEffect(() => {
    if (!gameSocket) return;
    gameSocket.on('match', () => {
      gameAction.setMatchState('FOUND');
      console.log('match found');
      displayConfirmation(
        'Match Found',
        'Would you like to accept the match?',
        null,
        joinGame,
        rejectGame,
      );
    }),
      gameSocket.on('disc', () => {
        gameSocket.disconnect();
      });
    gameSocket.on('connect', () => {
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', userId.id);
    });
    gameSocket.on('disconnect', () => {
      gameSocket.sendBuffer = [];
      console.log('game socket disconnected');
    });
    return () => {
      gameSocket.off('connect');
      gameSocket.off('disconnect');
      gameSocket.off('match');
      gameSocket.off('disc');

      gameSocket.disconnect();
    };
  }, []);

  const findMatch = () => {
    if (!gameSocket) return;
    gameSocket.connect();
    gameAction.setMatchState('SEARCHING');
    console.log(matchState);
  };

  const startGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('ready');
  };

  const disconnectGame = () => {
    if (!gameSocket) return;
    gameSocket.disconnect();
    gameAction.setMatchState('IDLE');
  };

  const resetGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('reset');
    gameSocket.disconnect();
  };

  const joinGame = () => {
    console.log('Joinin game');
    if (gameSocket) gameSocket.emit('join');
    gameAction.setMatchState('INGAME');
  };

  const rejectGame = () => {
    if (gameSocket) gameSocket.emit('reject');
    gameAction.setMatchState('IDLE');
  };
  return (
    <Box
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Button
        variant='contained'
        onClick={findMatch}
        disabled={matchState === 'SEARCHING'}
      >
        Find Match
      </Button>
      {/* <Button onClick={CheckStatus}>Check Status </Button> */}
      <Button
        variant='contained'
        onClick={startGame}
        disabled={matchState != 'FOUND'}
      >
        Start Game
      </Button>
      {/* <ConfirmationPrompt
        open={isMatchFound}
        onCloseHandler={rejectGame}
        promptTitle={'Match Found!'}
        promptDescription={'Accept this match?'}
        actionHandler={joinGame}
      ></ConfirmationPrompt> */}
      <Button
        variant='contained'
        onClick={resetGame}
        // disabled={matchState != 'FOUND'}
      >
        Reset
      </Button>

      <Button onClick={disconnectGame}>Disconnect</Button>
      {matchState === 'FOUND' && (
        <div>
          <GameRender />
        </div>
      )}
    </Box>
  );
}
