import { UserAchievement } from '@/types/UserAchievementTypes';
import { create } from 'zustand';
import callAPI from '../callAPI';
import { Achievement } from '@/types/AchievementTypes';

interface UserAchievementStore {
  data: {
    allAchievement: Achievement[];
    userAchievement: UserAchievement[];
  };
  actions: {
    getAchievementData: () => Promise<void>;
    getUserAchievementData: () => Promise<void>;
    // getUserAchieved: (userID: number) => void;
    // getAchievementsByUser: (userID: number) => Promise<Achievement>;
  };
  checks: {
    isAchieved: (userID: number, achievementID: number) => boolean;
  };
}

type StoreSetter = (
  helper: (state: UserAchievementStore) => Partial<UserAchievementStore>,
) => void;

type StoreGetter = () => UserAchievementStore;

async function getAchievementData(set: StoreSetter): Promise<void> {
  const AchievementData = JSON.parse(
    await callAPI('GET', 'achievements?search_type=ALL'),
  );
  // console.log('achievement data: ', AchievementData);
  set(({ data }) => ({
    data: { ...data, allAchievement: AchievementData },
  }));
}

async function getUserAchievementData(set: StoreSetter): Promise<void> {
  const userAchievementData = JSON.parse(
    await callAPI('GET', 'user-achievements?search_type=ALL'),
  );
  // console.log(userAchievementData);
  set(({ data }) => ({
    data: { ...data, userAchievement: userAchievementData },
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

function isAchieved(
  get: StoreGetter,
  userID: number,
  achievementID: number,
): boolean {
  return get().data.userAchievement.some(
    (obtained) =>
      obtained.user.id === userID && obtained.user.id === achievementID,
  );
}

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

const useUserAchievementStore = create<UserAchievementStore>()((set, get) => ({
  data: {
    userAchievement: [],
    allAchievement: [],
  },
  actions: {
    getUserAchievementData: () => getUserAchievementData(set),
    getAchievementData: () => getAchievementData(set),
    // getAchievementsByUser: (userID: number) => getAchievementsByUser(userID),
  },
  checks: {
    isAchieved: (userID: number, achievementID: number) =>
      isAchieved(get, userID, achievementID),
  },
}));

export const useUserAchievement = () =>
  useUserAchievementStore((state) => state.data.userAchievement);
export const useAchievement = () =>
  useUserAchievementStore((state) => state.data.allAchievement);
export const useUserAchievementAction = () =>
  useUserAchievementStore((state) => state.actions);
export const useUserAchievementChecks = () =>
  useUserAchievementStore((state) => state.checks);
