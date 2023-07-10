import { create } from 'zustand';
import { User } from '@/types/UserTypes';

interface UserStore {
  user: User;
  actions: {
    setUser: (user: User) => void;
  };
}

const useUserStore = create<UserStore>()((set) => ({
  user: {
    id: 0,
    username: '',
    refresh_token: '',
    date_of_creation: new Date(),
  },
  actions: {
    setUser: (user: User) => set({ user }),
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
