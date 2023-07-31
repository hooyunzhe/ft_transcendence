import { View } from '@/types/UtilTypes';
import { create } from 'zustand';

interface UtilStore {
  data: {
    currentView: View;
  };
  actions: {
    setCurrentView: (newView: View) => void;
    changeCurrentView: (newView: View) => void;
  };
}

type StoreSetter = (helper: (state: UtilStore) => Partial<UtilStore>) => void;
type StoreGetter = () => UtilStore;

function setCurrentView(set: StoreSetter, newView: View): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentView: newView,
    },
  }));
}

function changeCurrentView(
  set: StoreSetter,
  get: StoreGetter,
  newView: View,
): void {
  if (get().data.currentView === newView) {
    setCurrentView(set, View.EMPTY);
  } else {
    setCurrentView(set, newView);
  }
}

const useUtilStore = create<UtilStore>()((set, get) => ({
  data: {
    currentView: View.EMPTY,
  },
  actions: {
    setCurrentView: (newView: View) => setCurrentView(set, newView),
    changeCurrentView: (newView: View) => changeCurrentView(set, get, newView),
  },
}));

export const useCurrentView = () =>
  useUtilStore((state) => state.data.currentView);
export const useUtilActions = () => useUtilStore((state) => state.actions);
