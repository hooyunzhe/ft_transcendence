import { create } from 'zustand';
import { AlertColor } from '@mui/material';
import { Socket } from 'socket.io-client';
import { User } from '@/types/UserTypes';
import { ChannelMember } from '@/types/ChannelMemberTypes';
import { ChannelType } from '@/types/ChannelTypes';

interface NotificationStore {
  data: {
    display: boolean;
    level: AlertColor;
    message: string;
    isAchievement?: boolean;
  };
  actions: {
    displayNotification: (
      level: AlertColor,
      message: string,
      isAchievement?: boolean,
    ) => void;
    resetNotification: () => void;
    setupNotificationFriendSocketEvents: (friendSocket: Socket) => void;
    setupNotificationChannelSocketEvents: (
      channelSocket: Socket,
      currentUserID: number,
      isFriendBlocked: (incomingID: number) => boolean,
    ) => void;
    setupNotificationGameSocketEvents: (
      gameSocket: Socket,
      isFriendBlocked: (friendID: number) => boolean,
    ) => void;
  };
}

type StoreSetter = (
  helper: (state: NotificationStore) => Partial<NotificationStore>,
) => void;

function displayNotification(
  set: StoreSetter,
  level: AlertColor,
  message: string,
  isAchievement?: boolean,
): void {
  set(({}) => ({ data: { display: true, level, message, isAchievement } }));
}

function resetNotification(set: StoreSetter): void {
  set(({ data }) => ({ data: { ...data, display: false } }));
}

function setupNotificationFriendSocketEvents(
  set: StoreSetter,
  friendSocket: Socket,
): void {
  friendSocket.on('newRequest', () =>
    displayNotification(set, 'info', 'New friend request!'),
  );
  friendSocket.on('acceptRequest', (sender: User) =>
    displayNotification(
      set,
      'success',
      `${sender.username} accepted your friend request!`,
    ),
  );
  friendSocket.on('rejectRequest', (sender: User) =>
    displayNotification(
      set,
      'error',
      `${sender.username} rejected your friend request!`,
    ),
  );
}

function setupNotificationChannelSocketEvents(
  set: StoreSetter,
  channelSocket: Socket,
  currentUserID: number,
  isFriendBlocked: (incomingID: number) => boolean,
): void {
  channelSocket.on(
    'newMember',
    ({
      newMember,
      adminMember,
    }: {
      newMember: ChannelMember;
      adminMember: ChannelMember;
    }) =>
      newMember.channel.type !== ChannelType.DIRECT &&
      !isFriendBlocked(adminMember.user.id) &&
      displayNotification(
        set,
        'info',
        `${
          newMember.user.id === currentUserID
            ? 'You have'
            : newMember.user.username + ' has'
        } been added to ${newMember.channel.name}`,
      ),
  );
  channelSocket.on('kickMember', (member: ChannelMember) => {
    if (member.user.id === currentUserID) {
      displayNotification(
        set,
        'error',
        `You have been kicked from ${member.channel.name}`,
      );
    }
  });
}

function setupNotificationGameSocketEvents(
  set: StoreSetter,
  gameSocket: Socket,
  isFriendBlocked: (friendID: number) => boolean,
): void {
  gameSocket.on(
    'rejectInvite',
    (sender: User) =>
      !isFriendBlocked(sender.id) &&
      displayNotification(
        set,
        'error',
        `${sender.username} rejected your game invite!`,
      ),
  );
  gameSocket.on(
    'cancelInvite',
    (sender: User) =>
      !isFriendBlocked(sender.id) &&
      displayNotification(
        set,
        'error',
        `${sender.username} canceled the game invite`,
      ),
  );
}

const useNotificationStore = create<NotificationStore>()((set) => ({
  data: {
    display: false,
    level: 'success',
    message: '',
    isAchievement: false,
  },
  actions: {
    displayNotification: (level, message, isAchievement) =>
      displayNotification(set, level, message, isAchievement),
    resetNotification: () => resetNotification(set),
    setupNotificationFriendSocketEvents: (friendSocket) =>
      setupNotificationFriendSocketEvents(set, friendSocket),
    setupNotificationChannelSocketEvents: (
      channelSocket,
      currentUserID,
      isFriendBlocked,
    ) =>
      setupNotificationChannelSocketEvents(
        set,
        channelSocket,
        currentUserID,
        isFriendBlocked,
      ),
    setupNotificationGameSocketEvents: (gameSocket, isFriendBlocked) =>
      setupNotificationGameSocketEvents(set, gameSocket, isFriendBlocked),
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.data);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
