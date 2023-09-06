'use client';
import Phaser from 'phaser';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import GameMainScene from './scenes/GameMainScene';
import GameVictoryScene from './scenes/GameVictory';
import GameQuit from './GameQuit';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { useGameActions, useMatchInfo } from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';
import '../../styles/cyberthrone.css';
import GameVictory from './gameVictory';

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

export interface effectData {
  victory: boolean;
  reset: boolean;
}
export default function GameRender() {
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const viewAction = useUtilActions();
  const currentView = useCurrentView();
  const matchInfo = useMatchInfo();
  const { displayBackdrop } = useBackdropActions();
  const [gameSession, setGameSession] = useState<Phaser.Game | null>(null);

  let effectData: effectData = {
    victory: false,
    reset: false,
  };
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
      displayBackdrop(<GameQuit />);
    }
  };

  const clientsidePrediction = (timestamp: number) => {
    return gameInfo;
  };

  const effecthandler = (triggered?: boolean) => {
    if (triggered === false) effectData.reset = false;
    return effectData;
  };
  const endGame = () => {
    if (gameSocket) gameSocket.emit('end');
    viewAction.setCurrentView(View.GAME);
  };

  useEffect(() => {
    if (gameSocket) {
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

      gameSocket.on('disc', () => {
        displayBackdrop(
          <Box sx={{ ml: 2 }}>
            <Typography variant='h6'>
              Opponent disconnected, returning to main menu...
            </Typography>
          </Box>,
        );
        const timer = setTimeout(() => {
          gameAction.setMatchState(MatchState.IDLE);
          viewAction.setCurrentView(View.GAME);
          gameSocket.disconnect();
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      });

      gameSocket.on('victory', (player: number) => {
        effectData.victory = true;
        if (matchInfo)
          switch (player) {
            case 1:
              displayBackdrop(
                <GameVictory
                  victor={{
                    id: matchInfo.player1.id,
                    nickname: matchInfo.player1.nickname,
                  }}
                  loser={{
                    id: matchInfo.player2.id,
                    nickname: matchInfo.player2.nickname,
                  }}
                />,
              );
              break;
            case 2:
              displayBackdrop(
                <GameVictory
                  victor={{
                    id: matchInfo.player2.id,
                    nickname: matchInfo.player2.nickname,
                  }}
                  loser={{
                    id: matchInfo.player1.id,
                    nickname: matchInfo.player1.nickname,
                  }}
                />,
              );
              break;
            default:
              break;
          }
        const timer = setTimeout(() => {
          gameSocket.emit('end');
          clearTimeout(timer);
        }, 2000);
      });

      gameSocket.on('reset', () => {
        effectData.reset = true;
      });
    }
    const game = new GameMainScene(
      gameSocket,
      keyLoop,
      clientsidePrediction,
      effecthandler,
      matchInfo,
    );
    const config = {
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      parent: 'maingame',
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.AUTO,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      },

      scene: [game, new GameVictoryScene(endGame)],
    };

    if (!gameSession) setGameSession(new Phaser.Game(config));

    window.addEventListener('keyup', setKeyStateFalse, true);
    window.addEventListener('keydown', setKeyStateTrue, true);

    return () => {
      if (gameSession) gameSession.destroy(true, false);
      gameSocket?.off('game');
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
    <div
      style={{
        width: '100vw',
        height: '100vh',
        fontFamily: 'cyberthrone, Arial',
      }}
      id='maingame'
    />
  );
}
