import { Friend, FriendStatus } from '@/types/FriendTypes';
import { create } from 'zustand';

interface FriendStore {
  friends: Friend[];
  actions: {
    setFriends: (friends: Friend[]) => void;
    addFriend: (friend: Friend) => void;
    changeFriend: (
      incoming_id: number,
      current_status: FriendStatus,
      new_status: FriendStatus,
    ) => void;
    deleteFriend: (incoming_id: number) => void;
  };
}

const useFriendStore = create<FriendStore>()((set) => ({
  friends: [],
  actions: {
    setFriends: (friends) => set({ friends }),
    addFriend: (friend) =>
      set((state) => ({
        friends: [...state.friends, friend],
      })),
    changeFriend: (incoming_id, current_status, new_status) =>
      set((state) => ({
        friends: state.friends.map((friend) => {
          if (
            friend.incoming_friend.id === incoming_id &&
            friend.status === current_status
          ) {
            friend.status = new_status;
          }
          return friend;
        }),
      })),
    deleteFriend: (incoming_id) =>
      set((state) => ({
        friends: state.friends.filter(
          (friend) => friend.incoming_friend.id !== incoming_id,
        ),
      })),
  },
}));

export const useFriends = () => useFriendStore((state) => state.friends);
export const useFriendActions = () => useFriendStore((state) => state.actions);
