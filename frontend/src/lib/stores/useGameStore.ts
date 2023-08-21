import { create } from 'zustand';
import callAPI from '../callAPI';
import { Match, SkillPath } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';

type RecentMatchesDictionary = { [userID: number]: Match[] };

interface GameStore {
  data: {
    matches: Match[];
    matchesPlayed: Match[];
    recentMatches: RecentMatchesDictionary;
  };
  actions: {
    getGameData: (userID: number) => void;
    getMatchOpponent: (match: Match, userID: number) => User;
    getMatchScore: (match: Match, userID: number) => string;
    getMatchSkills: (match: Match, userID: number) => number[];
    getMatchPath: (match: Match, userID: number) => SkillPath;
    getPathName: (path: SkillPath | null) => string;
    addMatch: (newMatch: Match, currentUserID: number) => void;
  };
}

type StoreSetter = (helper: (state: GameStore) => Partial<GameStore>) => void;

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

const useGameStore = create<GameStore>()((set) => ({
  data: {
    matches: [],
    matchesPlayed: [],
    recentMatches: {},
  },
  actions: {
    getGameData: (userID) => getGameData(set, userID),
    getMatchOpponent: (match, userID) => getMatchOpponent(match, userID),
    getMatchScore: (match, userID) => getMatchScore(match, userID),
    getMatchSkills: (match, userID) => getMatchSkills(match, userID),
    getMatchPath: (match, userID) => getMatchPath(match, userID),
    getPathName: (path) => getPathName(path),
    addMatch: (newMatch, currentUserID) =>
      addMatch(set, newMatch, currentUserID),
  },
}));

export const useMatches = () => useGameStore((state) => state.data.matches);
export const useMatchesPlayed = () =>
  useGameStore((state) => state.data.matchesPlayed);
export const useRecentMatches = () =>
  useGameStore((state) => state.data.recentMatches);
export const useGameActions = () => useGameStore((state) => state.actions);
