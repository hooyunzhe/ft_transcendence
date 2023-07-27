import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { User, UserStatus } from '@/types/UserTypes';

type UserStatusDictionary = { [user_id: number]: UserStatus };

interface UserStore {
  data: {
    currentUser: User;
    userStatus: UserStatusDictionary;
  };
  actions: {
    setCurrentUser: (currentUser: User) => void;
    addUserStatus: (userSocket: Socket, userIDs: number[]) => void;
    changeUserStatus: (userID: number, newStatus: UserStatus) => void;
    setupUserSocketEvents: (userSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: UserStore) => Partial<UserStore>) => void;

function setCurrentUser(set: StoreSetter, currentUser: User): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentUser: currentUser,
    },
  }));
}

function setUserStatus(
  set: StoreSetter,
  userStatus: UserStatusDictionary,
): void {
  set(({ data }) => ({
    data: { ...data, userStatus: { ...data.userStatus, ...userStatus } },
  }));
}

function addUserStatus(
  set: StoreSetter,
  userSocket: Socket,
  userIDs: number[],
): void {
  userSocket.emit('getStatus', userIDs, (newStatus: UserStatusDictionary) => {
    setUserStatus(set, newStatus);
  });
}

function changeUserStatus(
  set: StoreSetter,
  userID: number,
  newStatus: UserStatus,
): void {
  setUserStatus(set, { [userID]: newStatus });
}

function setupUserSocketEvents(set: StoreSetter, userSocket: Socket): void {
  userSocket.on('newConnection', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.ONLINE),
  );
  userSocket.on('newDisconnect', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.OFFLINE),
  );
}

const useUserStore = create<UserStore>()((set) => ({
  data: {
    currentUser: {
      id: 0,
      username: '',
      refresh_token: '',
      date_of_creation: new Date(),
    },
    userStatus: {},
  },
  actions: {
    setCurrentUser: (currentUser) => setCurrentUser(set, currentUser),
    addUserStatus: (userSocket, userIDs) =>
      addUserStatus(set, userSocket, userIDs),
    changeUserStatus: (userID, newStatus) =>
      changeUserStatus(set, userID, newStatus),
    setupUserSocketEvents: (userSocket) =>
      setupUserSocketEvents(set, userSocket),
  },
}));

export const useCurrentUser = () =>
  useUserStore((state) => state.data.currentUser);
export const useUserStatus = () =>
  useUserStore((state) => state.data.userStatus);
export const useUserActions = () => useUserStore((state) => state.actions);
