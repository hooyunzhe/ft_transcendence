import { create } from 'zustand';

interface ConfirmationStore {
  data: {
    required: boolean;
    title: string;
    description: string;
    args: any | any[];
    handleAction: (...args: any[]) => void;
  };
  actions: {
    displayConfirmation: (
      title: string,
      description: string,
      args: any | any[],
      handleAction: (...args: any[]) => void,
    ) => void;
    resetConfirmation: () => void;
  };
}

type StoreSetter = (
  helper: (state: ConfirmationStore) => Partial<ConfirmationStore>,
) => void;

function displayConfirmation(
  set: StoreSetter,
  title: string,
  description: string,
  args: any | any[],
  handleAction: (...args: any[]) => void,
): void {
  set(({}) => ({
    data: {
      required: true,
      title,
      description,
      args,
      handleAction,
    },
  }));
}

function resetConfirmation(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      required: false,
    },
  }));
}

const useConfirmationStore = create<ConfirmationStore>()((set) => ({
  data: {
    required: false,
    title: '',
    description: '',
    args: [],
    handleAction: () => null,
  },
  actions: {
    displayConfirmation: (title, description, args, handleAction) =>
      displayConfirmation(set, title, description, args, handleAction),
    resetConfirmation: () => resetConfirmation(set),
  },
}));

export const useConfirmation = () =>
  useConfirmationStore((state) => state.data);
export const useConfirmationActions = () =>
  useConfirmationStore((state) => state.actions);
