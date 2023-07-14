import { create } from 'zustand';

interface ConfirmationStore {
  data: {
    required: boolean;
    title: string;
    description: string;
    arg: any;
    handleAction: (arg: any) => void;
  };
  actions: {
    displayConfirmation: (
      title: string,
      description: string,
      arg: any,
      handleAction: (arg: any) => void,
    ) => void;
    resetConfirmation: () => void;
  };
}

const useConfirmationStore = create<ConfirmationStore>()((set) => ({
  data: {
    required: false,
    title: '',
    description: '',
    arg: null,
    handleAction: () => null,
  },
  actions: {
    displayConfirmation: (title, description, arg, handleAction) =>
      set({ data: { required: true, title, description, arg, handleAction } }),
    resetConfirmation: () =>
      set({
        data: {
          required: false,
          title: '',
          description: '',
          arg: null,
          handleAction: () => null,
        },
      }),
  },
}));

export const useConfirmation = () =>
  useConfirmationStore((state) => state.data);
export const useConfirmationActions = () =>
  useConfirmationStore((state) => state.actions);
