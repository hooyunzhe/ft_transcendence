import { create } from 'zustand';
import { Friend, FriendStatus } from '@/types/FriendTypes';

interface FriendStore {
  data: {
    friends: Friend[];
  };
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
  data: { friends: [] },
  actions: {
    setFriends: (friends) => set({ data: { friends } }),
    addFriend: (friend) =>
      set(({ data }) => ({
        data: {
          friends: [...data.friends, friend],
        },
      })),
    changeFriend: (incoming_id, current_status, new_status) =>
      set(({ data }) => ({
        data: {
          friends: data.friends.map((friend) => {
            if (
              friend.incoming_friend.id === incoming_id &&
              friend.status === current_status
            ) {
              friend.status = new_status;
            }
            return friend;
          }),
        },
      })),
    deleteFriend: (incoming_id) =>
      set(({ data }) => ({
        data: {
          friends: data.friends.filter(
            (friend) => friend.incoming_friend.id !== incoming_id,
          ),
        },
      })),
  },
}));

export const useFriends = () => useFriendStore((state) => state.data.friends);
export const useFriendActions = () => useFriendStore((state) => state.actions);
