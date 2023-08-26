import { ReactNode } from 'react';
import { create } from 'zustand';

interface TwoFactorStore {
  data: {
    display: boolean;
    title: string;
    description: string;
    children: ReactNode;
    actionButtonText: string;
  };
  actions: {
    displayTwoFactor: (
      title: string,
      description: string,
      children: ReactNode,
      actionButtonText: string,
    ) => void;
    resetTwoFactor: () => void;
  };
}

type StoreSetter = (
  helper: (state: TwoFactorStore) => Partial<TwoFactorStore>,
) => void;

function displayTwoFactor(
  set: StoreSetter,
  title: string,
  description: string,
  children: ReactNode,
  actionButtonText: string,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      display: true,
      title: title,
      description: description,
      children: children,
      actionButtonText: actionButtonText,
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
    title: '',
    description: '',
    children: null,
    actionButtonText: '',
  },
  actions: {
    displayTwoFactor: (title, description, children, actionButtonText) =>
      displayTwoFactor(set, title, description, children, actionButtonText),
    resetTwoFactor: () => resetTwoFactor(set),
  },
}));

export const useTwoFactor = () => useTwoFactorStore((state) => state.data);
export const useTwoFactorActions = () =>
  useTwoFactorStore((state) => state.actions);
