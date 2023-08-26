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
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';
import { MatchState } from '@/types/GameTypes';

export default function GameMenu() {
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameAction = useGameActions();
  const viewAction = useUtilActions();
  const userId = useCurrentUser();
  const { displayConfirmation } = useConfirmationActions();

  useEffect(() => {
    if (!gameSocket) return;
    gameSocket.on('match', () => {
      gameAction.setMatchState(MatchState.FOUND);
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

    };
  }, []);

  const findMatch = () => {
    if (gameSocket) {
      gameSocket.connect();
      gameAction.setMatchState(MatchState.SEARCHING);
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', userId.id);
    }
    // viewAction.setCurrentView(View.LOADING);
    console.log(matchState);
  };

  const startGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('ready');
  };

  const disconnectGame = () => {
    if (!gameSocket) return;
    gameSocket.disconnect();
    gameAction.setMatchState(MatchState.IDLE);
  };

  const resetGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('reset');
    gameSocket.disconnect();
  };

  const joinGame = () => {
    console.log('Joinin game');
    if (gameSocket) gameSocket.emit('join');
    gameAction.setMatchState(MatchState.INGAME);
    viewAction.setCurrentView(View.LOADING);
  };

  const rejectGame = () => {
    if (gameSocket) gameSocket.emit('reject');
    gameAction.setMatchState(MatchState.IDLE);
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
        disabled={matchState === MatchState.SEARCHING}
      >
        Find Match
      </Button>
      {/* <Button onClick={CheckStatus}>Check Status </Button> */}
      <Button
        variant='contained'
        onClick={startGame}
        disabled={matchState != MatchState.FOUND}
      >
        Start Game
      </Button>
      <Button
        variant='contained'
        onClick={resetGame}
        // disabled={matchState != MatchState.FOUND}
      >
        Reset
      </Button>

      <Button onClick={disconnectGame}>Disconnect</Button>
      {/* {matchState === 'FOUND' && ( */}

      {/* )} */}
    </Box>
  );
}
