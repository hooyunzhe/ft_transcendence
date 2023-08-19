import { create } from 'zustand';
import callAPI from '../callAPI';
import { Achievement } from '@/types/AchievementTypes';
import { UserAchievement } from '@/types/UserAchievementTypes';

type AchievementsEarnedDictionary = { [achievementID: number]: boolean };
type RecentAchievementsDictionary = { [userID: number]: UserAchievement[] };

interface AchievementStore {
  data: {
    achievements: Achievement[];
    achievementsEarned: AchievementsEarnedDictionary;
    recentAchievements: RecentAchievementsDictionary;
  };
  actions: {
    getAchievementData: (userID: number) => Promise<void>;
  };
}

type StoreSetter = (
  helper: (state: AchievementStore) => Partial<AchievementStore>,
) => void;

async function getAchievementData(
  set: StoreSetter,
  userID: number,
): Promise<void> {
  const achievementData = JSON.parse(
    await callAPI('GET', 'achievements?search_type=ALL'),
  );
  const userAchievementData = JSON.parse(
    await callAPI('GET', 'user-achievements?search_type=ALL'),
  );
  const achievementsEarned: AchievementsEarnedDictionary = {};
  const recentAchievements: RecentAchievementsDictionary = {};

  userAchievementData.forEach((userAchievement: UserAchievement) => {
    if (userAchievement.user.id === userID) {
      achievementsEarned[userAchievement.achievement.id] = true;
    }
    if (!recentAchievements[userAchievement.user.id]) {
      recentAchievements[userAchievement.user.id] = [];
    }
    recentAchievements[userAchievement.user.id] = [
      ...recentAchievements[userAchievement.user.id],
      userAchievement,
    ];
  });

  for (const userID in recentAchievements) {
    recentAchievements[userID] = recentAchievements[userID].slice(-4).reverse();
  }

  set(({ data }) => ({
    data: {
      ...data,
      achievements: achievementData,
      achievementsEarned: achievementsEarned,
      recentAchievements: recentAchievements,
    },
  }));
}

const useAchievementStore = create<AchievementStore>()((set, get) => ({
  data: {
    achievements: [],
    achievementsEarned: {},
    recentAchievements: {},
  },
  actions: {
    getAchievementData: (userID) => getAchievementData(set, userID),
  },
}));

export const useAchievements = () =>
  useAchievementStore((state) => state.data.achievements);
export const useAchievementsEarned = () =>
  useAchievementStore((state) => state.data.achievementsEarned);
export const useRecentAchievements = () =>
  useAchievementStore((state) => state.data.recentAchievements);
export const useAchievementActions = () =>
  useAchievementStore((state) => state.actions);
