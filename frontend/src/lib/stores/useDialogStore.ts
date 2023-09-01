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
    actionButtonDisabled: boolean;
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
      actionOnEnterEnabled?: boolean,
    ) => void;
    changeDialog: (
      title: string,
      description: string,
      actionButtonText: string,
      backButtonText: string,
      actionButtonDisabled?: boolean,
    ) => void;
    changeActionText: (actionButtonText: string) => void;
    setActionButtonDisabled: (disabled: boolean) => void;
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

function changeDialog(
  set: StoreSetter,
  title: string,
  description: string,
  actionButtonText: string,
  backButtonText: string,
  actionButtonDisabled?: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      title: title,
      description: description,
      actionButtonText: actionButtonText,
      backButtonText: backButtonText,
      actionButtonDisabled: actionButtonDisabled ?? false,
    },
  }));
}

function changeActionText(set: StoreSetter, actionButtonText: string): void {
  set(({ data }) => ({
    data: {
      ...data,
      actionButtonText: actionButtonText,
    },
  }));
}

function setActionButtonDisabled(set: StoreSetter, disabled: boolean): void {
  set(({ data }) => ({
    data: {
      ...data,
      actionButtonDisabled: disabled,
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
    data: { ...data, display: false, actionButtonDisabled: true },
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
    actionButtonDisabled: true,
  },
  triggers: {
    actionClicked: false,
    backClicked: false,
  },
  actions: {
    displayDialog: (title, description, children, actionButtonText) =>
      displayDialog(set, title, description, children, actionButtonText),
    changeDialog: (
      title,
      description,
      actionButtonText,
      backButtonText,
      actionButtonDisabled,
    ) =>
      changeDialog(
        set,
        title,
        description,
        actionButtonText,
        backButtonText,
        actionButtonDisabled,
      ),
    changeActionText: (actionButtonText) =>
      changeActionText(set, actionButtonText),
    setActionButtonDisabled: (disabled) =>
      setActionButtonDisabled(set, disabled),
    setActionClicked: () => setActionClicked(set),
    setBackClicked: () => setBackClicked(set),
    resetDialog: () => resetDialog(set),
    resetTriggers: () => resetTriggers(set),
  },
}));

export const useDialog = () => useDialogStore((state) => state.data);
export const useDialogActionButtonDisabled = () =>
  useDialogStore((state) => state.data.actionButtonDisabled);
export const useDialogTriggers = () =>
  useDialogStore((state) => state.triggers);
export const useDialogActions = () => useDialogStore((state) => state.actions);
