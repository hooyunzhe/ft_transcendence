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
  set: StoreSetter,
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
    const achievementFound = get().data.achievements.find(
      (achievement) => achievement.id === achievementID,
    );

    if (achievementFound) {
      const achievementEarned = await callAPI('POST', 'user-achievements', {
        user_id: currentUserID,
        achievement_id: achievementID,
      }).then((res) => res.body);

      if (achievementEarned) {
        displayNotification(
          'info',
          `Achievement Earned: ${achievementFound.name}`,
          true,
        );
        addAchievementsEarned(set, achievementEarned, currentUserID);
        return false;
      } else {
        console.log('FATAL ERROR: FAILED TO GIVE USER ACHIEVEMENT IN BACKEND');
      }
    } else {
      console.log('FATAL ERROR: ACHIEVEMENT NOT FOUND');
    }
  }
  return true;
}

function addAchievementsEarned(
  set: StoreSetter,
  userAchievement: UserAchievement,
  currentUserID: number,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      achievementsEarned: {
        ...data.achievementsEarned,
        [userAchievement.achievement.id]: new Date(
          Date.now(),
        ).toLocaleDateString(),
      },
      recentAchievements: {
        ...data.recentAchievements,
        [currentUserID]: [
          userAchievement,
          ...data.recentAchievements[currentUserID].slice(0, -1),
        ],
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
    handleAchievementsEarned: (
      currentUserID: number,
      achievementID: number,
      displayNotification: (type: AlertColor, message: string) => void,
    ) =>
      handleAchievementsEarned(
        set,
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
