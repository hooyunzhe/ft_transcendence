import { create } from 'zustand';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { Socket } from 'socket.io-client';
import { User } from '@/types/UserTypes';

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
    setupFriendSocket: (friendSocket: Socket) => void;
  };
}

type StoreSetter = (
  helper: (state: FriendStore) => Partial<FriendStore>,
) => void;

function addFriend(set: StoreSetter, friend: Friend) {
  set(({ data }) => ({ data: { friends: [...data.friends, friend] } }));
}

function changeFriend(
  set: StoreSetter,
  incoming_id: number,
  current_status: FriendStatus,
  new_status: FriendStatus,
) {
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
  }));
}

function deleteFriend(set: StoreSetter, incoming_id: number) {
  set(({ data }) => ({
    data: {
      friends: data.friends.filter(
        (friend) => friend.incoming_friend.id !== incoming_id,
      ),
    },
  }));
}

function setupFriendSocket(set: StoreSetter, friendSocket: Socket) {
  friendSocket.on('newRequest', (request: Friend) => addFriend(set, request));
  friendSocket.on('deleteRequest', (sender: User) =>
    deleteFriend(set, sender.id),
  );
  friendSocket.on('acceptRequest', (sender: User) =>
    changeFriend(set, sender.id, FriendStatus.INVITED, FriendStatus.FRIENDS),
  );
  friendSocket.on('rejectRequest', (sender: User) =>
    deleteFriend(set, sender.id),
  );
}

const useFriendStore = create<FriendStore>()((set) => ({
  data: { friends: [] },
  actions: {
    setFriends: (friends) => set({ data: { friends } }),
    addFriend: (friend) => addFriend(set, friend),
    changeFriend: (incoming_id, current_status, new_status) =>
      changeFriend(set, incoming_id, current_status, new_status),
    deleteFriend: (incoming_id) => deleteFriend(set, incoming_id),
    setupFriendSocket: (friendSocket) => setupFriendSocket(set, friendSocket),
  },
}));

export const useFriends = () => useFriendStore((state) => state.data.friends);
export const useFriendActions = () => useFriendStore((state) => state.actions);
