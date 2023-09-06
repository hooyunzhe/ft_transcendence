import { ReactNode } from 'react';
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { User } from '@/types/UserTypes';

interface BackdropStore {
  data: {
    display: boolean;
    children: ReactNode;
    handleClose: (() => void) | undefined;
    fadeTransition: boolean;
  };
  actions: {
    displayBackdrop: (
      children: ReactNode,
      handleClose?: () => void,
      fadeTransition?: boolean,
    ) => void;
    resetBackdrop: () => void;
    setupBackdropSocketEvents: (
      gameSocket: Socket,
      newInviteComponent: ReactNode,
      matchFoundComponent: ReactNode,
      disconnectComponent: ReactNode,
      isFriendBlocked: (friendID: number) => boolean,
      currentUser: User,
    ) => void;
  };
}

type StoreSetter = (
  helper: (state: BackdropStore) => Partial<BackdropStore>,
) => void;

function displayBackdrop(
  set: StoreSetter,
  children: ReactNode,
  handleClose?: () => void,
  fadeTransition?: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      display: true,
      children: children,
      handleClose: handleClose,
      fadeTransition: fadeTransition ?? false,
    },
  }));
}

function resetBackdrop(set: StoreSetter): void {
  set(({ data }) => ({
    data: { ...data, display: false, children: null },
  }));
}

function setupBackdropSocketEvents(
  set: StoreSetter,
  gameSocket: Socket,
  newInviteComponent: ReactNode,
  matchFoundComponent: ReactNode,
  disconnectComponent: ReactNode,
  isFriendBlocked: (friendID: number) => boolean,
  currentUser: User,
): void {
  gameSocket.on('matchFound', () => displayBackdrop(set, matchFoundComponent));
  gameSocket.on('playerDisconnected', () =>
    displayBackdrop(set, disconnectComponent),
  );
  gameSocket.on(
    'newInvite',
    ({ user, room_id }) =>
      !isFriendBlocked(user.id) &&
      displayBackdrop(set, newInviteComponent, () => {
        gameSocket.emit('rejectInvite', {
          user: currentUser,
          room_id: room_id,
        });
        resetBackdrop(set);
      }),
  );
  gameSocket.on('cancelInvite', () => resetBackdrop(set));
}

const useBackdropStore = create<BackdropStore>()((set) => ({
  data: {
    display: false,
    children: null,
    handleClose: undefined,
    fadeTransition: false,
  },
  actions: {
    displayBackdrop: (children, handleClose, fadeTransition) =>
      displayBackdrop(set, children, handleClose, fadeTransition),
    resetBackdrop: () => resetBackdrop(set),
    setupBackdropSocketEvents: (
      gameSocket,
      newInviteComponent,
      matchFoundComponent,
      disconnectComponent,
      isFriendBlocked,
      currentUser,
    ) =>
      setupBackdropSocketEvents(
        set,
        gameSocket,
        newInviteComponent,
        matchFoundComponent,
        disconnectComponent,
        isFriendBlocked,
        currentUser,
      ),
  },
}));

export const useBackdrop = () => useBackdropStore((state) => state.data);
export const useBackdropActions = () =>
  useBackdropStore((state) => state.actions);
