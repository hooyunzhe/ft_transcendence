'use client';
import Phaser from 'phaser';
import { useEffect, useState } from 'react';
import GameMainScene from './scenes/GameMainScene';
import GameVictory from './GameVictory';
import GameQuit from './GameQuit';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useCurrentView } from '@/lib/stores/useUtilStore';
import {
  useGameActions,
  useMatchInfo,
  useMatchState,
} from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { GameMode, MatchState } from '@/types/GameTypes';
import { SkillClass } from '@/types/MatchTypes';

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
  const matchState = useMatchState();
  const currentView = useCurrentView();
  const matchInfo = useMatchInfo();
  const { displayBackdrop, resetBackdrop } = useBackdropActions();
  const [gameSession, setGameSession] = useState<Phaser.Game | null>(null);

  let effectData: effectData = {
    victory: false,
    reset: false,
  };
  let gameInfo: gameData;
  const keyLoop = () => {
    if (gameAction.getKeyState('w') || gameAction.getKeyState('W')) {
      if (gameSocket) gameSocket.emit('Player', 'w');
    }
    if (gameAction.getKeyState('s') || gameAction.getKeyState('S')) {
      if (gameSocket) gameSocket.emit('Player', 's');
    }
    if (gameAction.getKeyState(' ')) {
      if (gameSocket) gameSocket.emit('Player', ' ');
    }
    if (gameAction.getKeyState('e') || gameAction.getKeyState('E')) {
      if (gameSocket) gameSocket.emit('Player', 'e');
    }
    if (gameAction.getKeyState('Escape') || gameAction.getKeyState('Esc')) {
      displayBackdrop(<GameQuit />, () => null);
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
    gameAction.setGameReady(false);
    gameAction.setSelectedSkillClass(undefined);
    gameAction.setMatchState(MatchState.END);
    gameAction.setSelectedGameMode(GameMode.CYBERPONG);
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

      gameSocket.on('victory', (victorNum: 1 | 2) => {
        effectData.victory = true;
        if (matchInfo) {
          const loserNum = victorNum === 1 ? 2 : 1;

          displayBackdrop(
            <GameVictory
              victor={{
                id: matchInfo[`player${victorNum}`].id,
                nickname: matchInfo[`player${victorNum}`].nickname,
              }}
              loser={{
                id: matchInfo[`player${loserNum}`].id,
                nickname: matchInfo[`player${loserNum}`].nickname,
              }}
            />,
          );
        }
        setTimeout(() => endGame(), 3000);
        setTimeout(() => resetBackdrop(), 6000);
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

      scene: [game],
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
  }, [matchState]);

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
