import { create } from 'zustand';
import callAPI from '../callAPI';
import { Match, SkillPath } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';
import { MatchState, MatchInfo } from '@/types/GameTypes';


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
    getMatchOpponent: (match: Match, userID: number) => User;
    getMatchScore: (match: Match, userID: number) => string;
    getMatchSkills: (match: Match, userID: number) => number[];
    getMatchPath: (match: Match, userID: number) => SkillPath;
    getPathName: (path: SkillPath) => string;
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
  const matchData = JSON.parse(await callAPI('GET', 'matches?search_type=ALL'));
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

function getMatchSkills(match: Match, userID: number): number[] {
  const skills =
    match.player_one.id === userID ? match.p1_skills : match.p2_skills;
  return skills.split('|').map((skillID) => Number(skillID));
}

function getMatchPath(match: Match, userID: number): SkillPath {
  const skills =
    match.player_one.id === userID ? match.p1_skills : match.p2_skills;
  const skillIDS = skills.split('|').map((skillID) => Number(skillID));
  const strengthSkills = skillIDS.filter(
    (skill) => skill >= 1 && skill <= 5,
  ).length;
  const speedSkills = skillIDS.filter(
    (skill) => skill >= 6 && skill <= 10,
  ).length;
  const techSkills = skillIDS.filter(
    (skill) => skill >= 11 && skill <= 15,
  ).length;
  const skillCounts = [strengthSkills, speedSkills, techSkills];
  const topPath = skillCounts.indexOf(Math.max(...skillCounts));

  if (topPath === 0) {
    return SkillPath.STRENGTH;
  } else if (topPath === 1) {
    return SkillPath.SPEED;
  } else {
    return SkillPath.TECH;
  }
}

function getPathName(path: SkillPath | null): string {
  switch (path) {
    case SkillPath.STRENGTH:
      return 'Kratos';
    case SkillPath.SPEED:
      return 'Chronos';
    case SkillPath.TECH:
      return 'Qosmos';
    case null:
      return 'N/A';
  }
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
    getMatchOpponent: (match, userID) => getMatchOpponent(match, userID),
    getMatchScore: (match, userID) => getMatchScore(match, userID),
    getMatchSkills: (match, userID) => getMatchSkills(match, userID),
    getMatchPath: (match, userID) => getMatchPath(match, userID),
    getPathName: (path) => getPathName(path),
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
  export const useMatchInfo = () =>
  useGameStore((state) => state.data.matchInfo);