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
