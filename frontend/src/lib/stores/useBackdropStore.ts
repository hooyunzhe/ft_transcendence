import { ReactNode } from 'react';
import { create } from 'zustand';

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
  },
}));

export const useBackdrop = () => useBackdropStore((state) => state.data);
export const useBackdropActions = () =>
  useBackdropStore((state) => state.actions);
