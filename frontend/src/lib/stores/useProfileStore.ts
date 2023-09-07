import { create } from 'zustand';
import callAPI from '../callAPI';
import { Statistic } from '@/types/StatisticTypes';
import { Match, SkillClass } from '@/types/MatchTypes';

interface ProfileStore {
  data: {
    statistics: Statistic[];
    selectedStatistic: Statistic | undefined;
    selectedStatisticIndex: number | undefined;
  };
  actions: {
    getProfileData: () => void;
    getCurrentStatistic: (currentUserID: number) => Statistic | undefined;
    getFavoriteClass: (statistic: Statistic) => SkillClass | null;
    updateStatistic: (userID: number, newMatch: Match) => void;
    setSelectedStatistic: (userID: number | undefined) => void;
  };
  checks: {
    isJackOfAllTrades: (
      currentStatistic: Statistic,
      selectedSkillClass: SkillClass | undefined,
    ) => boolean;
    isMasterOfOne: (
      currentStatistic: Statistic,
      selectedSkillClass: SkillClass | undefined,
    ) => boolean;
  };
}

type StoreSetter = (
  helper: (state: ProfileStore) => Partial<ProfileStore>,
) => void;
type StoreGetter = () => ProfileStore;

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

function getCurrentStatistic(
  get: StoreGetter,
  currentUserID: number,
): Statistic | undefined {
  return get().data.statistics.find(
    (statistic) => statistic.user.id === currentUserID,
  );
}

function getFavoriteClass(statistic: Statistic): SkillClass | null {
  const classCounts = [
    statistic.strength_count,
    statistic.speed_count,
    statistic.tech_count,
  ];

  if (classCounts.every((count) => count === 0)) {
    return null;
  }

  switch (classCounts.indexOf(Math.max(...classCounts))) {
    case 0:
      return SkillClass.STRENGTH;
    case 1:
      return SkillClass.SPEED;
    case 2:
      return SkillClass.TECH;
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

  const classID =
    newMatch.player_one.id === currentStatistic.user.id
      ? newMatch.p1_class_id
      : newMatch.p2_class_id;

  if (classID === 1) {
    currentStatistic.strength_count++;
  } else if (classID === 2) {
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

function isJackOfAllTrades(
  currentStatistic: Statistic,
  selectedSkillClass: SkillClass | undefined,
): boolean {
  switch (selectedSkillClass) {
    case SkillClass.STRENGTH:
      return (
        currentStatistic.speed_count > 0 &&
        currentStatistic.tech_count > 0 &&
        currentStatistic.strength_count === 1
      );
    case SkillClass.SPEED:
      return (
        currentStatistic.strength_count > 0 &&
        currentStatistic.tech_count > 0 &&
        currentStatistic.speed_count === 1
      );
    case SkillClass.TECH:
      return (
        currentStatistic.strength_count > 0 &&
        currentStatistic.speed_count > 0 &&
        currentStatistic.tech_count === 1
      );
    default:
      return false;
  }
}

function isMasterOfOne(
  currentStatistic: Statistic,
  selectedSkillClass: SkillClass | undefined,
): boolean {
  switch (selectedSkillClass) {
    case SkillClass.STRENGTH:
      return currentStatistic.strength_count === 3;
    case SkillClass.SPEED:
      return currentStatistic.speed_count === 3;
    case SkillClass.TECH:
      return currentStatistic.tech_count === 3;
    default:
      return false;
  }
}

const useProfileStore = create<ProfileStore>()((set, get) => ({
  data: {
    statistics: [],
    selectedStatistic: undefined,
    selectedStatisticIndex: undefined,
  },
  actions: {
    getProfileData: () => getProfileData(set),
    getCurrentStatistic: (currentUserID) =>
      getCurrentStatistic(get, currentUserID),
    getFavoriteClass: (statistic) => getFavoriteClass(statistic),
    updateStatistic: (userID, newMatch) =>
      updateStatistic(set, userID, newMatch),
    setSelectedStatistic: (userID) => setSelectedStatistic(set, userID),
  },
  checks: {
    isJackOfAllTrades: (currentStatistic, selectedSkillClass) =>
      isJackOfAllTrades(currentStatistic, selectedSkillClass),
    isMasterOfOne: (currentStatistic, selectedSkillClass) =>
      isMasterOfOne(currentStatistic, selectedSkillClass),
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
export const useProfileChecks = () => useProfileStore((state) => state.checks);
