'use client';
import Phaser from 'phaser';
import { useEffect, useState } from 'react';
import GameMainScene from './phaser/GameMainScene';
import GameVictory from './overlay/GameVictory';
import GameQuit from './overlay/GameQuit';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
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
import {
  useProfileActions,
  useProfileChecks,
} from '@/lib/stores/useProfileStore';
import { GameData, GameMode, MatchState } from '@/types/GameTypes';
import { Match } from '@/types/MatchTypes';

export default function GameRender() {
  const currentUser = useCurrentUser();
  const currentPreference = useCurrentPreference();
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const matchState = useMatchState();
  const matchInfo = useMatchInfo();
  const selectedGameMode = useSelectedGameMode();
  const selectedSkillClass = useSelectedSkillClass();
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
    gameSocket?.emit('end');
    gameAction.setGameReady(false);
    gameAction.setSelectedGameMode(GameMode.CYBERPONG);
    gameAction.setSelectedSkillClass(undefined);
    gameAction.setMatchState(MatchState.END);
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
        gameSocket.on('victory', (newMatch: Match) => {
          setVictory(true);
          if (matchInfo) {
            const winner =
              newMatch.winner_id === newMatch.player_one.id
                ? newMatch.player_one
                : newMatch.player_two;
            const loser =
              newMatch.winner_id === newMatch.player_one.id
                ? newMatch.player_two
                : newMatch.player_one;

            gameAction.addMatch(newMatch, winner.id);
            gameAction.addMatch(newMatch, loser.id);
            updateStatistic(winner.id, newMatch);
            updateStatistic(loser.id, newMatch);
            displayBackdrop(
              <GameVictory
                victor={{
                  id: winner.id,
                  nickname: winner.username,
                }}
                loser={{
                  id: loser.id,
                  nickname: loser.username,
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
              if (winner.id === currentUser.id) {
                if (currentStatistic.current_winstreak === 5) {
                  handleAchievementsEarned(
                    currentUser.id,
                    11,
                    displayNotification,
                  );
                }
                if (newMatch.p1_score === 0 || newMatch.p2_score === 0) {
                  handleAchievementsEarned(
                    currentUser.id,
                    12,
                    displayNotification,
                  );
                }
              }
            }
            setTimeout(() => resetBackdrop(), 3000);
          }
          setTimeout(() => endGame(), 1500);
        });
      }

      const game = new GameMainScene(
        gameSocket,
        keyLoop,
        clientsidePrediction,
        victoryHandler,
        matchInfo,
        currentPreference.music_enabled,
        currentPreference.sound_effects_enabled,
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
        gameSocket?.off('reset');
        gameSocket?.off('skillOn');
        gameSocket?.off('skillOff');
        gameSession.destroy(true, true);
      }
    }

    window.addEventListener('keyup', setKeyStateFalse, true);
    window.addEventListener('keydown', setKeyStateTrue, true);

    return () => {
      if (gameSession) {
        gameSocket?.off('reset');
        gameSocket?.off('skillOn');
        gameSocket?.off('skillOff');
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
