import { create } from 'zustand';

interface TwoFactorStore {
  data: {
    display: boolean;
    setup: boolean;
    handleAction: () => void;
  };
  actions: {
    displayTwoFactor: (handleAction: () => void, setup?: boolean) => void;
    resetTwoFactor: () => void;
  };
}

type StoreSetter = (
  helper: (state: TwoFactorStore) => Partial<TwoFactorStore>,
) => void;

function displayTwoFactor(
  set: StoreSetter,
  handleAction: () => void,
  setup?: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      display: true,
      setup: setup ?? false,
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
    displayTwoFactor: (handleAction, setup) =>
      displayTwoFactor(set, handleAction, setup),
    resetTwoFactor: () => resetTwoFactor(set),
  },
}));

export const useTwoFactor = () => useTwoFactorStore((state) => state.data);
export const useTwoFactorActions = () =>
  useTwoFactorStore((state) => state.actions);
