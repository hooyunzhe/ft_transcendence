import { create } from 'zustand';
import { User } from '@/types/UserTypes';

interface UserStore {
  data: {
    user: User;
  };
  actions: {
    setUser: (user: User) => void;
  };
}

const useUserStore = create<UserStore>()((set) => ({
  data: {
    user: {
      id: 0,
      username: '',
      refresh_token: '',
      date_of_creation: new Date(),
    },
  },
  actions: {
    setUser: (user: User) => set({ data: { user } }),
  },
}));

export const useUser = () => useUserStore((state) => state.data.user);
export const useUserActions = () => useUserStore((state) => state.actions);
