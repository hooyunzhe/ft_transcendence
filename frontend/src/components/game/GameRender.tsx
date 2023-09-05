'use client';
import Phaser, { Time } from 'phaser';
import { useEffect, useRef, useState } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameMatchFoundScene from './scenes/GameVictory';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions, useMatchInfo } from '@/lib/stores/useGameStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';
import { Backdrop, Box, Button, Typography } from '@mui/material';
import GameVictoryScene from './scenes/GameVictory';
import { escape } from 'querystring';

export interface gameData {
  ball: { x: number; y: number };
  balldirection: { x: number; y: number };
  paddle1: { x: number; y: number };
  paddle2: { x: number; y: number };
  score: { player1: number; player2: number };
  paddlesize: {
    paddle1: { width: number; height: number };
    paddle2: { width: number; height: number };
  };
  timestamp: number;
}
export default function GameRender() {
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const viewAction = useUtilActions();
  const currentView = useCurrentView();
  const [disconnected, setDisconnected] = useState(false);
  const [escapeMenu, setEscapeMenu] = useState(false);
  const [gameSession, setGameSession] = useState<Phaser.Game | null>(null);
  const matchInfo = useMatchInfo();
  let gameInfo: gameData;
  const keyLoop = () => {
    if (gameAction.getKeyState('w')) {
      if (gameSocket) gameSocket.emit('Player', 'w');
    }
    if (gameAction.getKeyState('s')) {
      if (gameSocket) gameSocket.emit('Player', 's');
    }
    if (gameAction.getKeyState(' ')) {
      if (gameSocket) gameSocket.emit('Player', ' ');
    }
    if (gameAction.getKeyState('e')) {
      if (gameSocket) gameSocket.emit('Player', 'e');
    }
    if (gameAction.getKeyState('Escape') || gameAction.getKeyState('Esc')) {
      console.log('escape called');
      setEscapeMenu(true);
    }
  };

  if (gameSocket)
    gameSocket.on(
      'game',
      (data: {
        ball: { x: number; y: number };
        balldirection: { x: number; y: number };
        paddle1: { x: number; y: number };
        paddle2: { x: number; y: number };
        score: { player1: number; player2: number };
        paddlesize: {
          paddle1: { width: number; height: number };
          paddle2: { width: number; height: number };
        };
        timestamp: number;
      }) => {
        gameInfo = data;
      },
    );

  const clientsidePrediction = (timestamp: number) => {
    return gameInfo;
  };

  const endGame = () => {
    viewAction.setCurrentView(View.GAME);
  };

  const closeEscapeMenu = () => {
    setEscapeMenu(false);
  };
  useEffect(() => {
    if (gameSocket)
      gameSocket.on('disc', () => {
        setDisconnected(true);
        const timer = setTimeout(() => {
          gameAction.setMatchState(MatchState.IDLE);
          viewAction.setCurrentView(View.GAME);
          gameSocket.disconnect();
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      });
    console.log(matchInfo);
    const game = new GameMainScene(
      gameSocket,
      keyLoop,
      clientsidePrediction,
      matchInfo,
    );
    const config = {
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.AUTO,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        //     width: '100%',
        // height: '100%',
      },
      parent: 'maingame',

      scene: [game, new GameVictoryScene(endGame)],
    };

    if (!gameSession) setGameSession(new Phaser.Game(config));

    window.addEventListener('keyup', setKeyStateFalse, true);
    window.addEventListener('keydown', setKeyStateTrue, true);

    return () => {
      if (gameSession) gameSession.destroy(true, false);
      gameSocket?.disconnect();
      window.removeEventListener('keyup', setKeyStateFalse, true);
      window.removeEventListener('keydown', setKeyStateTrue, true);
    };
  }, [currentView]);

  function setKeyStateFalse(event: KeyboardEvent) {
    gameAction.setKeyState(event.key, false);
  }

  function setKeyStateTrue(event: KeyboardEvent) {
    gameAction.setKeyState(event.key, true);
  }

  return (
    <div id='maingame' style={{}}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={disconnected}
      >
        <Box sx={{ ml: 2 }}>
          <Typography variant='h6'>
            Opponent disconnected, returning to main menu...
          </Typography>
        </Box>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={escapeMenu && currentView === View.PHASER}
        onClick={closeEscapeMenu}
      >
        <Box sx={{ ml: 2 }}>
          <Typography variant='h6'>Do you want to Quit the game?</Typography>
          <Button variant='contained' onClick={endGame}>
            YES
          </Button>
        </Box>
      </Backdrop>
    </div>
  );
}
