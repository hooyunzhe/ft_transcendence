'use client';
import Phaser from 'phaser';
import { useEffect, useState } from 'react';
import GameMainScene from './phaser/GameMainScene';
import GameVictory from './overlay/GameVictory';
import GameQuit from './overlay/GameQuit';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import {
  useGameActions,
  useMatchInfo,
  useMatchState,
  useSelectedGameMode,
  useSelectedSkillClass,
} from '@/lib/stores/useGameStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { GameData, GameMode, MatchState } from '@/types/GameTypes';
import {
  useProfileActions,
  useProfileChecks,
} from '@/lib/stores/useProfileStore';

export interface effectData {
  victory: boolean;
  reset: boolean;
}
export default function GameRender() {
  const currentUser = useCurrentUser();
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const matchState = useMatchState();
  const matchInfo = useMatchInfo();
  const selectedGameMode = useSelectedGameMode();
  const selectedSkillClass = useSelectedSkillClass();
  const { getNewMatch } = useGameActions();
  const { getCurrentStatistic, updateStatistic } = useProfileActions();
  const { isJackOfAllTrades, isMasterOfOne } = useProfileChecks();
  const { handleAchievementsEarned } = useAchievementActions();
  const { displayNotification } = useNotificationActions();
  const { displayBackdrop, resetBackdrop } = useBackdropActions();
  const [gameSession, setGameSession] = useState<Phaser.Game | null>(null);
  const [victory, setVictory] = useState(false);
  let gameInfo: GameData;

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
      displayBackdrop(<GameQuit />, () => null);
    }
  };

  function setKeyStateFalse(event: KeyboardEvent) {
    gameAction.setKeyState(
      /^[WSE]$/.test(event.key) ? event.key.toLowerCase() : event.key,
      false,
    );
  }

  function setKeyStateTrue(event: KeyboardEvent) {
    gameAction.setKeyState(
      /^[WSE]$/.test(event.key) ? event.key.toLowerCase() : event.key,
      true,
    );
  }

  const clientsidePrediction = () => {
    return gameInfo;
  };

  const victoryHandler = () => {
    return victory;
  };

  const endGame = () => {
    if (gameSocket) gameSocket.emit('end');
    gameAction.setGameReady(false);
    gameAction.setSelectedSkillClass(undefined);
    gameAction.setMatchState(MatchState.END);
    gameAction.setSelectedGameMode(GameMode.CYBERPONG);
  };

  useEffect(() => {
    if (matchState === MatchState.INGAME) {
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
        gameSocket.on('victory', async (victorNum: 1 | 2) => {
          setVictory(true);
          if (matchInfo) {
            const isWinner =
              matchInfo[`player${victorNum}`].id === currentUser.id;
            const loserNum = victorNum === 1 ? 2 : 1;
            const newMatch = await getNewMatch(
              currentUser.id,
              isWinner
                ? matchInfo[`player${loserNum}`].id
                : matchInfo[`player${victorNum}`].id,
            );

            if (newMatch) {
              updateStatistic(currentUser.id, newMatch);
            }
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
            if (selectedGameMode === GameMode.CLASSIC) {
              handleAchievementsEarned(currentUser.id, 8, displayNotification);
            }
            const currentStatistic = getCurrentStatistic(currentUser.id);

            if (currentStatistic) {
              if (isJackOfAllTrades(currentStatistic, selectedSkillClass)) {
                handleAchievementsEarned(
                  currentUser.id,
                  9,
                  displayNotification,
                );
              }
              if (isMasterOfOne(currentStatistic, selectedSkillClass)) {
                handleAchievementsEarned(
                  currentUser.id,
                  10,
                  displayNotification,
                );
              }
              if (isWinner) {
                if (currentStatistic.current_winstreak === 5) {
                  handleAchievementsEarned(
                    currentUser.id,
                    11,
                    displayNotification,
                  );
                }
                if (gameInfo.score[`player${loserNum}`] === 0) {
                  handleAchievementsEarned(
                    currentUser.id,
                    12,
                    displayNotification,
                  );
                }
              }
            }
            setTimeout(() => resetBackdrop(), 6000);
          }
          setTimeout(() => endGame(), 3000);
        });
      }

      const game = new GameMainScene(
        gameSocket,
        keyLoop,
        clientsidePrediction,
        victoryHandler,
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

      if (!gameSession) {
        setGameSession(new Phaser.Game(config));
      }
    }

    if (matchState === MatchState.END) {
      if (gameSession) {
        gameSession.destroy(true, false);
      }
    }

    window.addEventListener('keyup', setKeyStateFalse, true);
    window.addEventListener('keydown', setKeyStateTrue, true);

    return () => {
      if (gameSession) {
        gameSession.destroy(true, false);
      }
      gameSocket?.off('game');
      gameSocket?.off('victory');
      window.removeEventListener('keyup', setKeyStateFalse, true);
      window.removeEventListener('keydown', setKeyStateTrue, true);
    };
  }, [matchState]);

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
