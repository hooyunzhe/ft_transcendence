import { create } from 'zustand';
import { AlertColor } from '@mui/material';
import { Socket } from 'socket.io-client';
import { User } from '@/types/UserTypes';

interface NotificationStore {
  data: {
    display: boolean;
    level: AlertColor;
    message: string;
  };
  actions: {
    displayNotification: (level: AlertColor, message: string) => void;
    resetNotification: () => void;
    setupNotificationSocketEvents: (friendSocket: Socket) => void;
  };
}

type StoreSetter = (
  helper: (state: NotificationStore) => Partial<NotificationStore>,
) => void;

function displayNotification(
  set: StoreSetter,
  level: AlertColor,
  message: string,
): void {
  set(({}) => ({ data: { display: true, level, message } }));
}

function resetNotification(set: StoreSetter): void {
  set(({ data }) => ({ data: { ...data, display: false } }));
}

function setupNotificationSocketEvents(
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
      sender.username + ' accepted your friend request!',
    ),
  );
  friendSocket.on('rejectRequest', (sender: User) =>
    displayNotification(
      set,
      'error',
      sender.username + ' rejected your friend request!',
    ),
  );
}

const useNotificationStore = create<NotificationStore>()((set) => ({
  data: {
    display: false,
    level: 'success',
    message: '',
  },
  actions: {
    displayNotification: (level, message) =>
      displayNotification(set, level, message),
    resetNotification: () => resetNotification(set),
    setupNotificationSocketEvents: (friendSocket) =>
      setupNotificationSocketEvents(set, friendSocket),
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.data);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
