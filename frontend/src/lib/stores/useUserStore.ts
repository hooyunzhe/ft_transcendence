import { create } from 'zustand';
import { User } from '@/types/UserTypes';

interface UserStore {
  data: {
    currentUser: User;
    userStatus: { [user_id: number]: string };
  };
  actions: {
    setCurrentUser: (currentUser: User) => void;
    setUserStatus: (userStatus: { [user_id: number]: string }) => void;
  };
}

const useUserStore = create<UserStore>()((set) => ({
  data: {
    currentUser: {
      id: 0,
      username: '',
      refresh_token: '',
      date_of_creation: new Date(),
    },
    userStatus: {},
  },
  actions: {
    setCurrentUser: (currentUser) =>
      set(({ data }) => ({
        data: { currentUser: currentUser, userStatus: data.userStatus },
      })),
    setUserStatus: (userStatus) =>
      set(({ data }) => ({
        data: { currentUser: data.currentUser, userStatus: userStatus },
      })),
  },
}));

export const useUser = () => useUserStore((state) => state.data.currentUser);
export const useUserActions = () => useUserStore((state) => state.actions);
