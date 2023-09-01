import { create } from 'zustand';
import { AlertColor } from '@mui/material';
import callAPI from '../callAPI';
import { Achievement } from '@/types/AchievementTypes';
import { UserAchievement } from '@/types/UserAchievementTypes';

type AchievementsEarnedDictionary = { [achievementID: number]: string };
type RecentAchievementsDictionary = { [userID: number]: UserAchievement[] };

interface AchievementStore {
  data: {
    achievements: Achievement[];
    achievementsEarned: AchievementsEarnedDictionary;
    recentAchievements: RecentAchievementsDictionary;
  };
  actions: {
    getAchievementData: (userID: number) => Promise<void>;
    addAchievementsEarned: (achievementID: number) => void;
    handleAchievementsEarned: (
      currentUserID: number,
      achievementID: number,
      displayNotification: (type: AlertColor, message: string) => void,
    ) => Promise<boolean>;
  };
}

type StoreSetter = (
  helper: (state: AchievementStore) => Partial<AchievementStore>,
) => void;
type StoreGetter = () => AchievementStore;

async function getAchievementData(
  set: StoreSetter,
  userID: number,
): Promise<void> {
  const achievementData = await callAPI(
    'GET',
    'achievements?search_type=ALL',
  ).then((res) => res.body);
  const userAchievementData = await callAPI(
    'GET',
    'user-achievements?search_type=ALL',
  ).then((res) => res.body);
  const achievementsEarned: AchievementsEarnedDictionary = {};
  const recentAchievements: RecentAchievementsDictionary = {};

  userAchievementData.forEach((userAchievement: UserAchievement) => {
    if (userAchievement.user.id === userID) {
      achievementsEarned[userAchievement.achievement.id] = new Date(
        Date.now(),
      ).toLocaleDateString();
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

async function handleAchievementsEarned(
  get: StoreGetter,
  currentUserID: number,
  achievementID: number,
  displayNotification: (
    type: AlertColor,
    message: string,
    isAchievement?: boolean,
  ) => void,
): Promise<boolean> {
  if (get().data.achievementsEarned[achievementID] === undefined) {
    await callAPI('POST', 'user-achievements', {
      user_id: currentUserID,
      achievement_id: achievementID,
    });
    const achievementFound = get().data.achievements.find(
      (achievement) => achievement.id === achievementID,
    );

    if (achievementFound) {
      displayNotification(
        'info',
        `Achievement Earned: ${achievementFound.name}`,
        true,
      );
      get().actions.addAchievementsEarned(achievementID);
    }
    return false;
  }
  return true;
}

function addAchievementsEarned(set: StoreSetter, achievementID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      achievementsEarned: {
        ...data.achievementsEarned,
        [achievementID]: new Date(Date.now()).toLocaleDateString(),
      },
    },
  }));
}

const useAchievementStore = create<AchievementStore>()((set, get) => ({
  data: {
    achievements: [],
    userAchievements: [],
    achievementsEarned: {},
    recentAchievements: {},
  },
  actions: {
    getAchievementData: (userID) => getAchievementData(set, userID),
    addAchievementsEarned: (achievementID: number) =>
      addAchievementsEarned(set, achievementID),
    handleAchievementsEarned: (
      currentUserID: number,
      achievementID: number,
      displayNotification: (type: AlertColor, message: string) => void,
    ) =>
      handleAchievementsEarned(
        get,
        currentUserID,
        achievementID,
        displayNotification,
      ),
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
