import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import callAPI from '../callAPI';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';

interface FriendStore {
  data: {
    friends: Friend[];
    selectedFriend: Friend | undefined;
  };
  actions: {
    getFriendData: (userID: number) => void;
    addFriend: (friend: Friend) => void;
    changeFriend: (
      friend: Friend,
      currentStatus: FriendStatus,
      newStatus: FriendStatus,
    ) => void;
    deleteFriend: (friend: Friend) => void;
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
  const friendData = await callAPI(
    'GET',
    `friends?search_type=USER&search_number=${userID}`,
  ).then((res) => res.body);

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

function resetSelectedFriend(set: StoreSetter, incomingID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedFriend:
        data.selectedFriend?.id === incomingID
          ? undefined
          : data.selectedFriend,
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
  friendSocket.on('deleteFriend', (sender: User) => {
    deleteFriend(set, sender.id);
    resetSelectedFriend(set, sender.id);
  });
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
    changeFriend: (friend, currentStatus, newStatus) =>
      changeFriend(set, friend.incoming_friend.id, currentStatus, newStatus),
    deleteFriend: (friend) => deleteFriend(set, friend.incoming_friend.id),
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
