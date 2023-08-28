import { create } from 'zustand';

interface TwoFactorStore {
  data: {
    display: boolean;
    setup: boolean;
    handleAction: () => void;
  };
  actions: {
    setupTwoFactor: () => void;
    displayTwoFactor: (handleAction: () => void) => void;
    resetTwoFactor: () => void;
  };
}

type StoreSetter = (
  helper: (state: TwoFactorStore) => Partial<TwoFactorStore>,
) => void;

function setupTwoFactor(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      display: true,
      setup: true,
      handleAction: () => null,
    },
  }));
}

function displayTwoFactor(set: StoreSetter, handleAction: () => void): void {
  set(({ data }) => ({
    data: {
      ...data,
      display: true,
      setup: false,
      handleAction: handleAction,
    },
  }));
}

function resetTwoFactor(set: StoreSetter): void {
  set(({ data }) => ({
    data: { ...data, display: false },
  }));
}

const useTwoFactorStore = create<TwoFactorStore>()((set) => ({
  data: {
    display: false,
    setup: false,
    handleAction: () => null,
  },
  actions: {
    setupTwoFactor: () => setupTwoFactor(set),
    displayTwoFactor: (handleAction) => displayTwoFactor(set, handleAction),
    resetTwoFactor: () => resetTwoFactor(set),
  },
}));

export const useTwoFactor = () => useTwoFactorStore((state) => state.data);
export const useTwoFactorActions = () =>
  useTwoFactorStore((state) => state.actions);
