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
      friendID: number,
      currentStatus: FriendStatus,
      newStatus: FriendStatus,
    ) => void;
    deleteFriend: (friendID: number) => void;
    setSelectedFriend: (friend: Friend | undefined) => void;
    resetSelectedFriend: (friendID: number) => void;
    setupFriendSocketEvents: (friendSocket: Socket) => void;
  };
  checks: {
    isFriendBlocked: (friendID: number) => boolean;
  };
}

type StoreSetter = (
  helper: (state: FriendStore) => Partial<FriendStore>,
) => void;
type StoreGetter = () => FriendStore;

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
  friendID: number,
  currentStatus: FriendStatus,
  newStatus: FriendStatus,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      friends: data.friends.map((friend) => {
        if (friend.id === friendID && friend.status === currentStatus) {
          friend.status = newStatus;
        }
        return friend;
      }),
    },
  }));
}

function deleteFriend(set: StoreSetter, friendID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      friends: data.friends.filter((friend) => friend.id !== friendID),
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

function resetSelectedFriend(set: StoreSetter, friendID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedFriend:
        data.selectedFriend?.id === friendID ? undefined : data.selectedFriend,
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

function isFriendBlocked(get: StoreGetter, incomingID: number): boolean {
  return get().data.friends.some(
    (friend) =>
      friend.incoming_friend.id === incomingID &&
      friend.status === FriendStatus.BLOCKED,
  );
}

const useFriendStore = create<FriendStore>()((set, get) => ({
  data: { friends: [], selectedFriend: undefined },
  actions: {
    getFriendData: (userID) => getFriendData(set, userID),
    addFriend: (friend) => addFriend(set, friend),
    changeFriend: (friendID, currentStatus, newStatus) =>
      changeFriend(set, friendID, currentStatus, newStatus),
    deleteFriend: (friendID) => deleteFriend(set, friendID),
    setSelectedFriend: (friend) => setSelectedFriend(set, friend),
    resetSelectedFriend: (friendID) => resetSelectedFriend(set, friendID),
    setupFriendSocketEvents: (friendSocket) =>
      setupFriendSocketEvents(set, friendSocket),
  },
  checks: {
    isFriendBlocked: (incomingID) => isFriendBlocked(get, incomingID),
  },
}));

export const useFriends = () => useFriendStore((state) => state.data.friends);
export const useSelectedFriend = () =>
  useFriendStore((state) => state.data.selectedFriend);
export const useFriendActions = () => useFriendStore((state) => state.actions);
export const useFriendChecks = () => useFriendStore((state) => state.checks);
