import { create } from 'zustand';
import { User } from '@/types/UserTypes';

interface UserStore {
  user: User;
}

const useUserStore = create<UserStore>()((set) => ({
  user: {
    id: 0,
    username: '',
    refresh_token: '',
    date_of_creation: new Date(),
  },
  setUser: (user: User) => set({ user }),
}));

export default useUserStore;
// for testing lol
