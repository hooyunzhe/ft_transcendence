import { View } from '@/types/UtilTypes';
import { create } from 'zustand';

interface UtilStore {
  data: {
    currentView: View;
  };
  actions: {
    setCurrentView: (newView: View) => void;
  };
}

type StoreSetter = (helper: (state: UtilStore) => Partial<UtilStore>) => void;

function setCurrentView(set: StoreSetter, newView: View): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentView: newView,
    },
  }));
}

const useUtilStore = create<UtilStore>()((set) => ({
  data: {
    currentView: View.EMPTY,
  },
  actions: {
    setCurrentView: (newView: View) => setCurrentView(set, newView),
  },
}));

export const useCurrentView = () =>
  useUtilStore((state) => state.data.currentView);
export const useUtilActions = () => useUtilStore((state) => state.actions);
