export enum GameType {
  CLASSIC = 'CLASSIC',
  CYBERPONG = 'CYBERPONG',
}

export enum MatchState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  INVITING = 'INVITING',
  FOUND = 'FOUND',
  READY = 'READY',
  INGAME = 'INGAME',
  SPECTATE = 'SPECTATE',
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
