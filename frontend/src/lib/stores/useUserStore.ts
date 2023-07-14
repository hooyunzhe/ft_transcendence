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
    setupUserSocket: (userSocket: Socket, userID: number) => void;
    resetUserSocket: (userSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: UserStore) => Partial<UserStore>) => void;

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

function setupUserSocket(
  set: StoreSetter,
  userSocket: Socket,
  userID: number,
): void {
  userSocket.on('socketConnected', () =>
    userSocket.emit('initConnection', userID),
  );
  userSocket.on('newConnection', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.ONLINE),
  );
  userSocket.on('newDisconnect', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.OFFLINE),
  );
}

function resetUserSocket(userSocket: Socket) {
  userSocket.removeAllListeners('socketConnected');
  userSocket.removeAllListeners('newConnection');
  userSocket.removeAllListeners('newDisconnect');
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
    setCurrentUser: (currentUser) =>
      set(({ data }) => ({
        data: { ...data, currentUser: currentUser },
      })),
    addUserStatus: (userSocket, userIDs) =>
      addUserStatus(set, userSocket, userIDs),
    changeUserStatus: (userID, newStatus) =>
      changeUserStatus(set, userID, newStatus),
    setupUserSocket: (userSocket, userID) =>
      setupUserSocket(set, userSocket, userID),
    resetUserSocket: resetUserSocket,
  },
}));

export const useCurrentUser = () =>
  useUserStore((state) => state.data.currentUser);
export const useUserStatus = () =>
  useUserStore((state) => state.data.userStatus);
export const useUserActions = () => useUserStore((state) => state.actions);
