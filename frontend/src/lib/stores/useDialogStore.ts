import { ReactNode } from 'react';
import { create } from 'zustand';

interface DialogStore {
  data: {
    display: boolean;
    title: string;
    description: string;
    backButtonText: string;
    backHandler: () => void;
    actionButtonText: string;
    handleAction: () => Promise<void>;
    children: ReactNode;
  };
  actions: {
    setDialogPrompt: (
      display: boolean,
      title: string,
      description: string,
      backButtonText: string,
      backHandler: () => void,
      actionButtonText: string,
      handleAction: () => Promise<void>,
      children: ReactNode,
    ) => void;
    resetDialog: () => void;
  };
}

type StoreSetter = (
  helper: (state: DialogStore) => Partial<DialogStore>,
) => void;

function setDialogPrompt(
  set: StoreSetter,
  display: boolean,
  title: string,
  description: string,
  backButtonText: string,
  backHandler: () => void,
  actionButtonText: string,
  handleAction: () => Promise<void>,
  children: ReactNode,
): void {
  set(({}) => ({
    data: {
      display: display,
      title: title,
      description: description,
      backButtonText: backButtonText,
      backHandler: backHandler,
      actionButtonText: actionButtonText,
      handleAction: handleAction,
      children: children,
    },
  }));
}

function resetDialog(set: StoreSetter): void {
  set(({ data }) => ({ data: { ...data, display: false } }));
}

const useDialogStore = create<DialogStore>()((set) => ({
  data: {
    display: false,
    title: '',
    description: '',
    backButtonText: '',
    backHandler: () => null,
    actionButtonText: '',
    handleAction: async () => {},
    children: null,
  },
  actions: {
    setDialogPrompt: (
      display,
      title,
      description,
      backButtonText,
      backHandler,
      actionButtonText,
      handleAction,
      children,
    ) =>
      setDialogPrompt(
        set,
        display,
        title,
        description,
        backButtonText,
        backHandler,
        actionButtonText,
        handleAction,
        children,
      ),
    resetDialog: () => resetDialog(set),
  },
}));

export const useDialog = () => useDialogStore((state) => state.data);
export const useDialogActions = () => useDialogStore((state) => state.actions);
