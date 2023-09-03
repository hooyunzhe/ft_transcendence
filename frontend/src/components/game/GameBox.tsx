'use client';
import GameMenu from './GameMenu';
import GameReady from './GameReady';
import { useMatchState } from '@/lib/stores/useGameStore';
import { MatchState } from '@/types/GameTypes';

export default function GameBox() {
  const matchState = useMatchState();

  return matchState === MatchState.READY || matchState === MatchState.INGAME ? (
    <GameReady />
  ) : (
    <GameMenu />
  );
}
