export enum GameMode {
  CLASSIC = 'CLASSIC',
  CYBERPONG = 'CYBERPONG',
}

export enum MatchState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  FOUND = 'FOUND',
  READY = 'READY',
  INGAME = 'INGAME',
  END = 'END',
}

export interface GameData {
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

export interface MatchInfo {
  player1: {
    id: number;
    nickname: string;
    avatar: string;
  };
  player2: {
    id: number;
    nickname: string;
    avatar: string;
  };
}
