import { create } from 'zustand';
import callAPI from '../callAPI';
import { Match, SkillPath } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';

interface GameStore {
  data: {
    matches: Match[];
  };
  actions: {
    getGameData: () => void;
    getMatchHistory: (userID: number) => Match[];
    getRecentMatchHistory: (userID: number) => Match[];
    getMatchOpponent: (match: Match, userID: number) => User;
    getMatchScore: (match: Match, userID: number) => string;
    getMatchSkills: (match: Match, userID: number) => number[];
    getMatchPath: (match: Match, userID: number) => SkillPath;
    getPathName: (path: SkillPath) => string;
    addMatch: (newMatch: Match) => void;
  };
}

type StoreSetter = (helper: (state: GameStore) => Partial<GameStore>) => void;
type StoreGetter = () => GameStore;

async function getGameData(set: StoreSetter): Promise<void> {
  const matchData = JSON.parse(await callAPI('GET', 'matches?search_type=ALL'));

  set(({ data }) => ({
    data: {
      ...data,
      matches: matchData,
    },
  }));
}

function getMatchHistory(get: StoreGetter, userID: number): Match[] {
  return get().data.matches.filter(
    (match) => match.player_one.id === userID || match.player_two.id === userID,
  );
}

function getRecentMatchHistory(get: StoreGetter, userID: number): Match[] {
  return getMatchHistory(get, userID).slice(-5).reverse();
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

function getPathName(path: SkillPath): string {
  switch (path) {
    case SkillPath.STRENGTH:
      return 'Kratos';
    case SkillPath.SPEED:
      return 'Chronos';
    case SkillPath.TECH:
      return 'Qosmos';
  }
}

function addMatch(set: StoreSetter, newMatch: Match): void {
  set(({ data }) => ({
    data: {
      ...data,
      matches: [...data.matches, newMatch],
    },
  }));
}

const useGameStore = create<GameStore>()((set, get) => ({
  data: {
    matches: [],
  },
  actions: {
    getGameData: () => getGameData(set),
    getMatchHistory: (userID) => getMatchHistory(get, userID),
    getRecentMatchHistory: (userID) => getRecentMatchHistory(get, userID),
    getMatchOpponent: (match, userID) => getMatchOpponent(match, userID),
    getMatchScore: (match, userID) => getMatchScore(match, userID),
    getMatchSkills: (match, userID) => getMatchSkills(match, userID),
    getMatchPath: (match, userID) => getMatchPath(match, userID),
    getPathName: (path) => getPathName(path),
    addMatch: (newMatch) => addMatch(set, newMatch),
  },
}));

export const useMatches = () => useGameStore((state) => state.data.matches);
export const useGameActions = () => useGameStore((state) => state.actions);
