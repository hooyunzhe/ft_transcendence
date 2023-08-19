import { create } from 'zustand';
import callAPI from '../callAPI';
import { Achievement } from '@/types/AchievementTypes';
import { UserAchievement } from '@/types/UserAchievementTypes';

type AchievementsEarnedDictionary = { [achievement_id: number]: boolean };
type RecentAchievementsDictionary = { [user_id: number]: UserAchievement[] };

interface AchievementStore {
  data: {
    achievements: Achievement[];
    achievementsEarned: AchievementsEarnedDictionary;
    recentAchievements: RecentAchievementsDictionary;
  };
  actions: {
    getAchievementData: () => Promise<void>;
  };
}

type StoreSetter = (
  helper: (state: AchievementStore) => Partial<AchievementStore>,
) => void;

async function getAchievementData(set: StoreSetter): Promise<void> {
  const achievementData = JSON.parse(
    await callAPI('GET', 'achievements?search_type=ALL'),
  );
  const userAchievementData = JSON.parse(
    await callAPI('GET', 'user-achievements?search_type=ALL'),
  );
  const achievementsEarnedData: AchievementsEarnedDictionary = {};
  const recentAchievementsData: RecentAchievementsDictionary = {};

  userAchievementData.forEach((userAchievement: UserAchievement) => {
    achievementsEarnedData[userAchievement.achievement.id] = true;
    if (!recentAchievementsData[userAchievement.user.id]) {
      recentAchievementsData[userAchievement.user.id] = [];
    }
    recentAchievementsData[userAchievement.user.id] = [
      ...recentAchievementsData[userAchievement.user.id],
      userAchievement,
    ];
  });

  for (const userID in recentAchievementsData) {
    recentAchievementsData[userID] = recentAchievementsData[userID].slice(-5);
  }

  set(({ data }) => ({
    data: {
      ...data,
      achievements: achievementData,
      achievementsEarned: achievementsEarnedData,
      recentAchievements: recentAchievementsData,
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
    getAchievementData: () => getAchievementData(set),
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
