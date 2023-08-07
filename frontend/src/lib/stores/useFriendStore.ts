import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';
import callAPI from '../callAPI';

interface FriendStore {
  data: {
    friends: Friend[];
    selectedFriend: Friend | undefined;
  };
  actions: {
    getFriendData: (userID: number) => void;
    addFriend: (friend: Friend) => void;
    changeFriend: (
      incomingID: number,
      currentStatus: FriendStatus,
      newStatus: FriendStatus,
    ) => void;
    deleteFriend: (incomingID: number) => void;
    setSelectedFriend: (friend: Friend | undefined) => void;
    setupFriendSocketEvents: (friendSocket: Socket) => void;
  };
}

type StoreSetter = (
  helper: (state: FriendStore) => Partial<FriendStore>,
) => void;

async function getFriendData(set: StoreSetter, userID: number): Promise<void> {
  const friendData = JSON.parse(
    await callAPI('GET', `friends?search_type=USER&search_number=${userID}`),
  );

  set(({ data }) => ({
    data: {
      ...data,
      friends: friendData,
    },
  }));
}

function addFriend(set: StoreSetter, friend: Friend): void {
  set(({ data }) => ({
    data: { ...data, friends: [...data.friends, friend] },
  }));
}

function changeFriend(
  set: StoreSetter,
  incomingID: number,
  currentStatus: FriendStatus,
  newStatus: FriendStatus,
): void {
  set(({ data }) => ({
    data: {
      ...data,
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
      ...data,
      friends: data.friends.filter(
        (friend) => friend.incoming_friend.id !== incomingID,
      ),
    },
  }));
}

function setSelectedFriend(set: StoreSetter, friend: Friend | undefined): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedFriend: friend,
    },
  }));
}

function setupFriendSocketEvents(set: StoreSetter, friendSocket: Socket): void {
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
  friendSocket.on('deleteFriend', (sender: User) =>
    deleteFriend(set, sender.id),
  );
}

const useFriendStore = create<FriendStore>()((set) => ({
  data: { friends: [], selectedFriend: undefined },
  actions: {
    getFriendData: (userID) => getFriendData(set, userID),
    addFriend: (friend) => addFriend(set, friend),
    changeFriend: (incomingID, currentStatus, newStatus) =>
      changeFriend(set, incomingID, currentStatus, newStatus),
    deleteFriend: (incomingID) => deleteFriend(set, incomingID),
    setSelectedFriend: (friend) => setSelectedFriend(set, friend),
    setupFriendSocketEvents: (friendSocket) =>
      setupFriendSocketEvents(set, friendSocket),
  },
}));

export const useFriends = () => useFriendStore((state) => state.data.friends);
export const useSelectedFriend = () =>
  useFriendStore((state) => state.data.selectedFriend);
export const useFriendActions = () => useFriendStore((state) => state.actions);
