export enum MatchState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  FOUND = 'FOUND',
  READY = 'READY',
  INGAME = 'INGAME',
  SPECTATE = 'SPECTATE',
}

export interface MatchInfo {
  player1: {
    nickname: string;
    avatar: string;
  };
  player2: {
    nickname: string;
    avatar: string;
  };
}
