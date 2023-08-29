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
    changeCurrentUsername: (newUsername: string) => void;
    changeCurrentUserAvatar: (newAvatarUrl: string) => void;
    setCurrentUserTwoFactorEnabled: (enabled: boolean) => void;
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

function changeCurrentUsername(set: StoreSetter, newUsername: string): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentUser: { ...data.currentUser, username: newUsername },
    },
  }));
}

function changeCurrentUserAvatar(set: StoreSetter, newAvatarUrl: string): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentUser: { ...data.currentUser, avatar_url: newAvatarUrl },
    },
  }));
}

function setCurrentUserTwoFactorEnabled(
  set: StoreSetter,
  enabled: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentUser: { ...data.currentUser, two_factor_enabled: enabled },
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
      intra_id: '',
      username: '',
      refresh_token: '',
      avatar_url: '',
      two_factor_enabled: false,
      date_of_creation: '',
    },
    userStatus: {},
  },
  actions: {
    setCurrentUser: (currentUser) => setCurrentUser(set, currentUser),
    changeCurrentUsername: (newUsername) =>
      changeCurrentUsername(set, newUsername),
    changeCurrentUserAvatar: (newAvatarUrl) =>
      changeCurrentUserAvatar(set, newAvatarUrl),
    setCurrentUserTwoFactorEnabled: (enabled) =>
      setCurrentUserTwoFactorEnabled(set, enabled),
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
