import { create } from 'zustand';
import callAPI from '../callAPI';
import { Statistic } from '@/types/StatisticTypes';
import { Match } from '@/types/MatchTypes';

interface ProfileStore {
  data: {
    statistics: Statistic[];
    selectedStatistic: Statistic | undefined;
  };
  actions: {
    getProfileData: () => void;
    updateStatistic: (userID: number, newMatch: Match) => void;
    setSelectedStatistic: (userID: number | undefined) => void;
  };
}

type StoreSetter = (
  helper: (state: ProfileStore) => Partial<ProfileStore>,
) => void;

async function getProfileData(set: StoreSetter): Promise<void> {
  const statisticData = JSON.parse(
    await callAPI('GET', 'statistics?search_type=ALL'),
  );

  set(({ data }) => ({
    data: {
      ...data,
      statistics: statisticData,
    },
  }));
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
      statistics: data.statistics.map((statistic) =>
        statistic.user.id === userID
          ? getUpdatedStatistic(statistic, newMatch)
          : statistic,
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
    },
  }));
}

const useProfileStore = create<ProfileStore>()((set) => ({
  data: {
    statistics: [],
    selectedStatistic: undefined,
  },
  actions: {
    getProfileData: () => getProfileData(set),
    updateStatistic: (userID, newMatch) =>
      updateStatistic(set, userID, newMatch),
    setSelectedStatistic: (userID) => setSelectedStatistic(set, userID),
  },
}));

export const useStatistics = () =>
  useProfileStore((state) => state.data.statistics);
export const useSelectedStatistic = () =>
  useProfileStore((state) => state.data.selectedStatistic);
export const useProfileActions = () =>
  useProfileStore((state) => state.actions);
