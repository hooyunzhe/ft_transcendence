import { ReactNode } from 'react';
import { create } from 'zustand';

interface DialogStore {
  data: {
    display: boolean;
    title: string;
    description: string;
    children: ReactNode;
    actionButtonText: string;
    backButtonText: string;
  };
  triggers: {
    actionClicked: boolean;
    backClicked: boolean;
  };
  actions: {
    displayDialog: (
      title: string,
      description: string,
      children: ReactNode,
      actionButtonText: string,
      backButtonText?: string,
    ) => void;
    setActionClicked: () => void;
    setBackClicked: () => void;
    resetDialog: () => void;
    resetTriggers: () => void;
  };
}

type StoreSetter = (
  helper: (state: DialogStore) => Partial<DialogStore>,
) => void;

function displayDialog(
  set: StoreSetter,
  title: string,
  description: string,
  children: ReactNode,
  actionButtonText: string,
  backButtonText?: string,
): void {
  set(({}) => ({
    data: {
      display: true,
      title: title,
      description: description,
      children: children,
      actionButtonText: actionButtonText,
      backButtonText: backButtonText ?? 'Cancel',
    },
  }));
}

function setActionClicked(set: StoreSetter): void {
  set(({}) => ({
    triggers: {
      actionClicked: true,
      backClicked: false,
    },
  }));
}

function setBackClicked(set: StoreSetter): void {
  set(({}) => ({
    triggers: {
      actionClicked: false,
      backClicked: true,
    },
  }));
}

function resetDialog(set: StoreSetter): void {
  set(({ data }) => ({
    data: { ...data, display: false },
    triggers: { actionClicked: false, backClicked: false },
  }));
}

function resetTriggers(set: StoreSetter): void {
  set(({}) => ({
    triggers: { actionClicked: false, backClicked: false },
  }));
}

const useDialogStore = create<DialogStore>()((set) => ({
  data: {
    display: false,
    title: '',
    description: '',
    children: null,
    actionButtonText: '',
    backButtonText: 'Cancel',
  },
  triggers: {
    actionClicked: false,
    backClicked: false,
  },
  actions: {
    displayDialog: (
      title,
      description,
      children,
      actionButtonText,
      backButtonText,
    ) =>
      displayDialog(
        set,
        title,
        description,
        children,
        actionButtonText,
        backButtonText,
      ),
    setActionClicked: () => setActionClicked(set),
    setBackClicked: () => setBackClicked(set),
    resetDialog: () => resetDialog(set),
    resetTriggers: () => resetTriggers(set),
  },
}));

export const useDialog = () => useDialogStore((state) => state.data);
export const useDialogTriggers = () =>
  useDialogStore((state) => state.triggers);
export const useDialogActions = () => useDialogStore((state) => state.actions);
