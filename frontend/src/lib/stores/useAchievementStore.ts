import { UserAchievement } from '@/types/UserAchievementTypes';
import { create } from 'zustand';
import callAPI from '../callAPI';
import { Achievement } from '@/types/AchievementTypes';

type AchievementsEarnedDictionary = { [achievement_id: number]: boolean };
type RecentAchievementsDictionary = { [user_id: number]: Achievement[] };

interface AchievementStore {
  data: {
    achievements: Achievement[];
    achievementsEarned: AchievementsEarnedDictionary;
    recentAchievements: RecentAchievementsDictionary;
  };
  actions: {
    getAchievementData: () => Promise<void>;
    // getUserAchievementData: () => Promise<void>;
    // getUserAchieved: (userID: number) => void;
    // getAchievementsByUser: (userID: number) => Promise<Achievement>;
  };
  // checks: {
  //   isAchieved: (userID: number, achievementID: number) => boolean;
  // };
}

type StoreSetter = (
  helper: (state: AchievementStore) => Partial<AchievementStore>,
) => void;

type StoreGetter = () => AchievementStore;

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
      userAchievement.achievement,
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

async function getAchievementsByUser(userID: number): Promise<UserAchievement> {
  const userAchievementData = JSON.parse(
    await callAPI(
      'GET',
      'user-achievements?search_type=USER&search_number=' + userID,
    ),
  );
  console.log(userAchievementData);
  return userAchievementData;
}

// function isAchieved(
//   get: StoreGetter,
//   userID: number,
//   achievementID: number,
// ): boolean {
//   return get().data..some(
//     (obtained) =>
//       obtained.user.id === userID && obtained.user.id === achievementID,
//   );
// }

// async function getUserbyAchievements(
//   achievementID: number,
// ): Promise<UserAchievement> {
//   const userAchievementData = JSON.parse(
//     await callAPI(
//       'GET',
//       'user-achievements?search_type=USER&search_number=' + achievementID,
//     ),
//   );
//   console.log(userAchievementData);
//   return userAchievementData;
// }

// function addAchievementsToUser(set: StoreSetter, userID: number): void {
//   set(({ data }) => ({
//     data: {
//       ...data,
//       userAchievement : [...data.channelMembers, channelMember],
//     },
//   }));
// }

const useAchievementStore = create<AchievementStore>()((set, get) => ({
  data: {
    achievements: [],
    achievementsEarned: {},
    recentAchievements: {},
  },
  actions: {
    // getUserAchievementData: () => getUserAchievementData(set),
    getAchievementData: () => getAchievementData(set),
    // getAchievementsByUser: (userID: number) => getAchievementsByUser(userID),
  },
  // checks: {
  // isAchieved: (userID: number, achievementID: number) =>
  //   isAchieved(get, userID, achievementID),
  // },
}));

export const useAchievements = () =>
  useAchievementStore((state) => state.data.achievements);
export const useAchievementsEarned = () =>
  useAchievementStore((state) => state.data.achievementsEarned);
export const useRecentAchievements = () =>
  useAchievementStore((state) => state.data.recentAchievements);
export const useAchievementActions = () =>
  useAchievementStore((state) => state.actions);
// export const useUserAchievementChecks = () =>
// useAchievementStore((state) => state.checks);
