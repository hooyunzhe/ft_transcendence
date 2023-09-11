import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import callAPI from '../callAPI';
import { User, UserStatus } from '@/types/UserTypes';
import { Preference, PreferenceType } from '@/types/PreferenceTypes';

type UserStatusDictionary = { [user_id: number]: UserStatus };

interface UserStore {
  data: {
    currentUser: User;
    currentPreference: Preference;
    isNewUser: boolean;
    userStatus: UserStatusDictionary;
  };
  actions: {
    getUserData: (intraID: string) => void;
    setNewUser: (newUser: User, preference: Preference) => void;
    changeCurrentUsername: (newUsername: string) => void;
    changeCurrentUserAvatar: (newAvatarUrl: string) => void;
    setCurrentUserTwoFactorEnabled: (enabled: boolean) => void;
    changeCurrentPreference: (type: PreferenceType, checked: boolean) => void;
    addUserStatus: (userSocket: Socket, userIDs: number[]) => void;
    changeUserStatus: (userID: number, newStatus: UserStatus) => void;
    setupUserSocketEvents: (userSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: UserStore) => Partial<UserStore>) => void;

async function getUserData(set: StoreSetter, intraID: string): Promise<void> {
  const userData = await callAPI(
    'GET',
    `users?search_type=INTRA&search_string=${intraID}`,
  ).then((res) => res.body);

  if (userData) {
    const preference = await callAPI(
      'GET',
      `preferences?search_type=USER&search_number=${userData.id}`,
    ).then((res) => res.body);

    if (preference) {
      set(({ data }) => ({
        data: {
          ...data,
          currentUser: userData,
          currentPreference: preference,
        },
      }));
    }
  } else {
    set(({ data }) => ({
      data: {
        ...data,
        isNewUser: true,
      },
    }));
  }
}

function setNewUser(
  set: StoreSetter,
  newUser: User,
  preference: Preference,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentUser: newUser,
      currentPreference: preference,
      isNewUser: false,
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

function changeCurrentPreference(
  set: StoreSetter,
  type: PreferenceType,
  checked: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentPreference: {
        ...data.currentPreference,
        ...(type === PreferenceType.MUSIC && { music_enabled: checked }),
        ...(type === PreferenceType.SOUND_EFFECTS && {
          sound_effects_enabled: checked,
        }),
        ...(type === PreferenceType.ANIMATIONS && {
          animations_enabled: checked,
        }),
      },
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
  userSocket.emit('getStatus', userIDs, (newStatus: UserStatusDictionary) =>
    setUserStatus(set, newStatus),
  );
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
  userSocket.on('joinGame', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.IN_GAME),
  );
  userSocket.on('leaveGame', (userID: number) =>
    changeUserStatus(set, userID, UserStatus.ONLINE),
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
    currentPreference: {
      id: 0,
      music_enabled: false,
      sound_effects_enabled: false,
      animations_enabled: false,
    },
    isNewUser: false,
    userStatus: {},
  },
  actions: {
    getUserData: (intraID) => getUserData(set, intraID),
    setNewUser: (newUser, preference) => setNewUser(set, newUser, preference),
    changeCurrentUsername: (newUsername) =>
      changeCurrentUsername(set, newUsername),
    changeCurrentUserAvatar: (newAvatarUrl) =>
      changeCurrentUserAvatar(set, newAvatarUrl),
    setCurrentUserTwoFactorEnabled: (enabled) =>
      setCurrentUserTwoFactorEnabled(set, enabled),
    changeCurrentPreference: (type, checked) =>
      changeCurrentPreference(set, type, checked),
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
export const useCurrentPreference = () =>
  useUserStore((state) => state.data.currentPreference);
export const useIsNewUser = () => useUserStore((state) => state.data.isNewUser);
export const useUserStatus = () =>
  useUserStore((state) => state.data.userStatus);
export const useUserActions = () => useUserStore((state) => state.actions);
