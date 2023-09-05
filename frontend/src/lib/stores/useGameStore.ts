import { create } from 'zustand';
import callAPI from '../callAPI';
import { Match, SkillClass } from '@/types/MatchTypes';
import { MatchState, MatchInfo } from '@/types/GameTypes';
import { User } from '@/types/UserTypes';

type RecentMatchesDictionary = { [userID: number]: Match[] };

interface GameStore {
  data: {
    matches: Match[];
    matchesPlayed: Match[];
    recentMatches: RecentMatchesDictionary;
    matchState: MatchState;
    keyState: { [key: string]: boolean };
    matchInfo: MatchInfo | null;
    gameReady: boolean;
    skillState: boolean[];
  };
  actions: {
    getGameData: (userID: number) => void;
    getNotableOpponents: (userID: number) => {
      punchingBag: string;
      archenemy: string;
    };
    getMatchOpponent: (match: Match, userID: number) => User;
    getMatchScore: (match: Match, userID: number) => string;
    getMatchClass: (match: Match, userID: number) => SkillClass | null;
    getClassName: (path: SkillClass | null) => string;
    getKeyState: (key: string) => boolean;
    addMatch: (newMatch: Match, currentUserID: number) => void;
    setMatchState: (matchState: MatchState) => void;
    setKeyState: (key: string, isPressed: boolean) => void;
    setMatchInfo: (matchinfo: MatchInfo) => void;
    setGameReady: (ready: boolean) => void;
    setSkillState: (skillState: boolean[]) => void;
  };
}

type StoreSetter = (helper: (state: GameStore) => Partial<GameStore>) => void;
type StoreGetter = () => GameStore;

async function getGameData(set: StoreSetter, userID: number): Promise<void> {
  const matchData = await callAPI('GET', 'matches?search_type=ALL').then(
    (res) => res.body,
  );
  const matchesPlayed: Match[] = [];
  const recentMatches: RecentMatchesDictionary = {};

  matchData.forEach((match: Match) => {
    if (match.player_one.id === userID || match.player_two.id === userID) {
      matchesPlayed.push(match);
    }
    if (!recentMatches[match.player_one.id]) {
      recentMatches[match.player_one.id] = [];
    }
    if (!recentMatches[match.player_two.id]) {
      recentMatches[match.player_two.id] = [];
    }
    recentMatches[match.player_one.id] = [
      ...recentMatches[match.player_one.id],
      match,
    ];
    recentMatches[match.player_two.id] = [
      ...recentMatches[match.player_two.id],
      match,
    ];
  });

  for (const userID in recentMatches) {
    recentMatches[userID] = recentMatches[userID].slice(-4).reverse();
  }

  set(({ data }) => ({
    data: {
      ...data,
      matches: matchData,
      matchesPlayed: matchesPlayed,
      recentMatches: recentMatches,
    },
  }));
}

function getNotableOpponents(
  get: StoreGetter,
  userID: number,
): { punchingBag: string; archenemy: string } {
  const bags: { [username: string]: number } = {};
  const enemies: { [username: string]: number } = {};

  get().data.matches.forEach((match) => {
    const opponentNum =
      match.player_one.id === userID ? 'two' : match.player_two.id ? 'one' : '';

    if (opponentNum) {
      if (match.winner_id === userID) {
        if (!bags[match[`player_${opponentNum}`].username]) {
          bags[match[`player_${opponentNum}`].username] = 0;
        }
        bags[match[`player_${opponentNum}`].username]++;
      } else {
        if (!enemies[match[`player_${opponentNum}`].username]) {
          enemies[match[`player_${opponentNum}`].username] = 0;
        }
        enemies[match[`player_${opponentNum}`].username]++;
      }
    }
  });
  return {
    punchingBag: Object.keys(bags).length
      ? Object.entries(bags).reduce((max, current) =>
          current[1] > max[1] ? current : max,
        )[0]
      : 'N/A',
    archenemy: Object.keys(enemies).length
      ? Object.entries(enemies).reduce((max, current) =>
          current[1] > max[1] ? current : max,
        )[0]
      : 'N/A',
  };
}

function getMatchOpponent(match: Match, userID: number): User {
  return match.player_one.id === userID ? match.player_two : match.player_one;
}

function getMatchScore(match: Match, userID: number): string {
  if (match.player_one.id === userID) {
    return `${match.p1_score} / ${match.p2_score}`;
  } else {
    return `${match.p2_score} / ${match.p1_score}`;
  }
}

function getMatchClass(match: Match, userID: number): SkillClass | null {
  const classID =
    match.player_one.id === userID ? match.p1_class_id : match.p2_class_id;

  if (classID === 1) {
    return SkillClass.STRENGTH;
  } else if (classID === 2) {
    return SkillClass.SPEED;
  } else if (classID === 3) {
    return SkillClass.TECH;
  } else {
    return null;
  }
}

function getClassName(skillClass: SkillClass | null): string {
  switch (skillClass) {
    case SkillClass.STRENGTH:
      return 'Kratos';
    case SkillClass.SPEED:
      return 'Chronos';
    case SkillClass.TECH:
      return 'Qosmos';
    case null:
      return 'N/A';
  }
}

function setKeyState(set: StoreSetter, key: string, isPressed: boolean): void {
  set((state) => ({
    data: {
      ...state.data,
      keyState: {
        ...state.data.keyState,
        [key]: isPressed,
      },
    },
  }));
}

function getKeyState(key: string, get: StoreGetter) {
  const keyState = get().data.keyState;
  return !!keyState[key];
}

function addMatch(
  set: StoreSetter,
  newMatch: Match,
  currentUserID: number,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      matches: [...data.matches, newMatch],
      matchesPlayed: [...data.matchesPlayed, newMatch],
      recentMatches: {
        ...data.recentMatches,
        [currentUserID]: [
          newMatch,
          ...data.recentMatches[currentUserID].slice(0, -1),
        ],
      },
    },
  }));
}

function setMatchState(set: StoreSetter, matchState: MatchState): void {
  set((state) => ({
    data: {
      ...state.data,
      matchState: matchState,
    },
  }));
}

function setGameReady(set: StoreSetter, ready: boolean): void {
  set((state) => ({
    data: {
      ...state.data,
      gameReady: ready,
    },
  }));
}

function setSkillState(set: StoreSetter, skillState: boolean[]): void {
  set((state) => ({
    data: {
      ...state.data,
      skillState: skillState,
    },
  }));
}

function setMatchInfo(set: StoreSetter, matchInfo: MatchInfo): void {
  set((state) => ({
    data: {
      ...state.data,
      matchInfo: matchInfo,
    },
  }));
}

const useGameStore = create<GameStore>()((set, get) => ({
  data: {
    matches: [],
    matchesPlayed: [],
    recentMatches: {},
    matchState: MatchState.IDLE,
    keyState: {},
    gameReady: false,
    matchInfo: null,
    skillState: [],
  },
  actions: {
    getGameData: (userID) => getGameData(set, userID),
    getNotableOpponents: (userID) => getNotableOpponents(get, userID),
    getMatchOpponent: (match, userID) => getMatchOpponent(match, userID),
    getMatchScore: (match, userID) => getMatchScore(match, userID),
    getMatchClass: (match, userID) => getMatchClass(match, userID),
    getClassName: (path) => getClassName(path),
    getKeyState: (key) => getKeyState(key, get),
    addMatch: (newMatch, currentUserID) =>
      addMatch(set, newMatch, currentUserID),
    setMatchState: (MatchState) => setMatchState(set, MatchState),
    setKeyState: (key, isPressed) => setKeyState(set, key, isPressed),
    setMatchInfo: (matchInfo) => setMatchInfo(set, matchInfo),
    setGameReady: (ready) => setGameReady(set, ready),
    setSkillState: (skillState) => setSkillState(set, skillState),
  },
}));

export const useMatches = () => useGameStore((state) => state.data.matches);
export const useMatchesPlayed = () =>
  useGameStore((state) => state.data.matchesPlayed);
export const useRecentMatches = () =>
  useGameStore((state) => state.data.recentMatches);
export const useGameActions = () => useGameStore((state) => state.actions);
export const useMatchState = () =>
  useGameStore((state) => state.data.matchState);
export const useMatchInfo = () => useGameStore((state) => state.data.matchInfo);
