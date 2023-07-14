import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';

interface FriendStore {
  data: {
    friends: Friend[];
  };
  actions: {
    setFriends: (friends: Friend[]) => void;
    addFriend: (friend: Friend) => void;
    changeFriend: (
      incomingID: number,
      currentStatus: FriendStatus,
      newStatus: FriendStatus,
    ) => void;
    deleteFriend: (incomingID: number) => void;
    setupFriendSocketEvents: (friendSocket: Socket, userID: number) => void;
  };
}

type StoreSetter = (
  helper: (state: FriendStore) => Partial<FriendStore>,
) => void;

function addFriend(set: StoreSetter, friend: Friend): void {
  set(({ data }) => ({ data: { friends: [...data.friends, friend] } }));
}

function changeFriend(
  set: StoreSetter,
  incomingID: number,
  currentStatus: FriendStatus,
  newStatus: FriendStatus,
): void {
  set(({ data }) => ({
    data: {
      friends: data.friends.map((friend) => {
        if (
          friend.incoming_friend.id === incomingID &&
          friend.status === currentStatus
        ) {
          friend.status = newStatus;
        }
        return friend;
      }),
    },
  }));
}

function deleteFriend(set: StoreSetter, incomingID: number): void {
  set(({ data }) => ({
    data: {
      friends: data.friends.filter(
        (friend) => friend.incoming_friend.id !== incomingID,
      ),
    },
  }));
}

function setupFriendSocketEvents(
  set: StoreSetter,
  friendSocket: Socket,
  userID: number,
): void {
  friendSocket.on('socketConnected', () =>
    friendSocket.emit('initConnection', userID),
  );
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
    changeFriend: (incomingID, currentStatus, newStatus) =>
      changeFriend(set, incomingID, currentStatus, newStatus),
    deleteFriend: (incomingID) => deleteFriend(set, incomingID),
    setupFriendSocketEvents: (friendSocket, userID) =>
      setupFriendSocketEvents(set, friendSocket, userID),
  },
}));

export const useFriends = () => useFriendStore((state) => state.data.friends);
export const useFriendActions = () => useFriendStore((state) => state.actions);
