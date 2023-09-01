import { create } from 'zustand';
import callAPI from '../callAPI';
import { Statistic } from '@/types/StatisticTypes';
import { Match, SkillPath } from '@/types/MatchTypes';

interface ProfileStore {
  data: {
    statistics: Statistic[];
    selectedStatistic: Statistic | undefined;
    selectedStatisticIndex: number | undefined;
  };
  actions: {
    getProfileData: () => void;
    getFavoritePath: (statistic: Statistic) => SkillPath | null;
    updateStatistic: (userID: number, newMatch: Match) => void;
    setSelectedStatistic: (userID: number | undefined) => void;
  };
}

type StoreSetter = (
  helper: (state: ProfileStore) => Partial<ProfileStore>,
) => void;

async function getProfileData(set: StoreSetter): Promise<void> {
  const statisticData: Statistic[] = await callAPI(
    'GET',
    'statistics?search_type=ALL',
  ).then((res) => res.body);

  set(({ data }) => ({
    data: {
      ...data,
      statistics: statisticData.sort(
        (a, b) =>
          b.wins - a.wins ||
          a.losses - b.losses ||
          b.highest_winstreak - a.highest_winstreak,
      ),
    },
  }));
}

function getFavoritePath(statistic: Statistic): SkillPath | null {
  const pathCounts = [
    statistic.strength_count ?? 0,
    statistic.speed_count ?? 0,
    statistic.tech_count ?? 0,
  ];

  if (pathCounts.every((count) => count === 0)) {
    return null;
  }

  switch (pathCounts.indexOf(Math.max(...pathCounts))) {
    case 0:
      return SkillPath.STRENGTH;
    case 1:
      return SkillPath.SPEED;
    case 2:
      return SkillPath.TECH;
    default:
      return null;
  }
}

function getUpdatedStatistic(
  currentStatistic: Statistic,
  newMatch: Match,
): Statistic {
  if (newMatch.winner_id === currentStatistic.user.id) {
    currentStatistic.wins++;
    currentStatistic.current_winstreak++;
    if (
      currentStatistic.current_winstreak > currentStatistic.highest_winstreak
    ) {
      currentStatistic.highest_winstreak++;
    }
  } else {
    currentStatistic.losses++;
    currentStatistic.current_winstreak = 0;
  }

  const skills =
    newMatch.player_one.id === currentStatistic.user.id
      ? newMatch.p1_skills
      : newMatch.p2_skills;
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
    currentStatistic.strength_count++;
  } else if (topPath === 1) {
    currentStatistic.speed_count++;
  } else {
    currentStatistic.tech_count++;
  }

  return currentStatistic;
}

function updateStatistic(
  set: StoreSetter,
  userID: number,
  newMatch: Match,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      statistics: data.statistics
        .map((statistic) =>
          statistic.user.id === userID
            ? getUpdatedStatistic(statistic, newMatch)
            : statistic,
        )
        .sort(
          (a, b) =>
            b.wins - a.wins ||
            a.losses - b.losses ||
            b.highest_winstreak - a.highest_winstreak,
        ),
    },
  }));
}

function setSelectedStatistic(
  set: StoreSetter,
  userID: number | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedStatistic: data.statistics.find(
        (statistic) => statistic.user.id === userID,
      ),
      selectedStatisticIndex: data.statistics.findIndex(
        (statistic) => statistic.user.id === userID,
      ),
    },
  }));
}

const useProfileStore = create<ProfileStore>()((set) => ({
  data: {
    statistics: [],
    selectedStatistic: undefined,
    selectedStatisticIndex: undefined,
  },
  actions: {
    getProfileData: () => getProfileData(set),
    getFavoritePath: (statistic) => getFavoritePath(statistic),
    updateStatistic: (userID, newMatch) =>
      updateStatistic(set, userID, newMatch),
    setSelectedStatistic: (userID) => setSelectedStatistic(set, userID),
  },
}));

export const useStatistics = () =>
  useProfileStore((state) => state.data.statistics);
export const useSelectedStatistic = () =>
  useProfileStore((state) => state.data.selectedStatistic);
export const useSelectedStatisticIndex = () =>
  useProfileStore((state) => state.data.selectedStatisticIndex);
export const useProfileActions = () =>
  useProfileStore((state) => state.actions);
