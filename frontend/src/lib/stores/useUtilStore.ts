import { SocialTab, View } from '@/types/UtilTypes';
import { create } from 'zustand';

interface UtilStore {
  data: {
    currentView: View;
    currentSocialTab: SocialTab;
    socialDrawerToggle: boolean;
    channelMemberDrawerToggle: boolean;
    drawerTimeoutID: NodeJS.Timeout | undefined;
  };
  actions: {
    setCurrentView: (newView: View) => void;
    changeCurrentView: (newView: View) => void;
    setCurrentSocialTab: (newTab: SocialTab) => void;
    setSocialDrawerOpen: () => void;
    setSocialDrawerClose: () => void;
    setChannelMemberDrawerOpen: () => void;
    setChannelMemberDrawerClose: () => void;
    handleDrawerMouseOver: (channelSelected: boolean) => void;
    handleDrawerMouseLeave: () => void;
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

function setCurrentSocialTab(set: StoreSetter, newTab: SocialTab): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentSocialTab: newTab,
    },
  }));
}

function setSocialDrawerOpen(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      socialDrawerToggle: true,
    },
  }));
}
function setSocialDrawerClose(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      socialDrawerToggle: false,
    },
  }));
}

function setChannelMemberDrawerClose(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      channelMemberDrawerToggle: false,
    },
  }));
}

function setChannelMemberDrawerOpen(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      channelMemberDrawerToggle: true,
    },
  }));
}

function handleDrawerMouseOver(
  set: StoreSetter,
  get: StoreGetter,
  channelSelected: boolean,
): void {
  clearTimeout(get().data.drawerTimeoutID);
  setSocialDrawerOpen(set);
  if (channelSelected) {
    setChannelMemberDrawerOpen(set);
  }
}

function handleDrawerMouseLeave(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      drawerTimeoutID: setTimeout(() => {
        setSocialDrawerClose(set);
        setChannelMemberDrawerClose(set);
      }, 2000),
    },
  }));
}

const useUtilStore = create<UtilStore>()((set, get) => ({
  data: {
    currentView: View.EMPTY,
    currentSocialTab: SocialTab.FRIEND,
    channelMemberDrawerToggle: false,
    socialDrawerToggle: false,
    drawerTimeoutID: undefined,
    channelSelected: false,
  },
  actions: {
    setCurrentView: (newView) => setCurrentView(set, newView),
    changeCurrentView: (newView) => changeCurrentView(set, get, newView),
    setCurrentSocialTab: (newTab) => setCurrentSocialTab(set, newTab),
    setSocialDrawerOpen: () => setSocialDrawerOpen(set),
    setSocialDrawerClose: () => setSocialDrawerClose(set),
    setChannelMemberDrawerOpen: () => setChannelMemberDrawerOpen(set),
    setChannelMemberDrawerClose: () => setChannelMemberDrawerClose(set),
    handleDrawerMouseOver: (channelSelected) =>
      handleDrawerMouseOver(set, get, channelSelected),
    handleDrawerMouseLeave: () => handleDrawerMouseLeave(set),
  },
}));

export const useCurrentView = () =>
  useUtilStore((state) => state.data.currentView);
export const useCurrentSocialTab = () =>
  useUtilStore((state) => state.data.currentSocialTab);
export const useChannelMemberDrawerToggle = () =>
  useUtilStore((state) => state.data.channelMemberDrawerToggle);
export const useSocialDrawerToggle = () =>
  useUtilStore((state) => state.data.socialDrawerToggle);
export const useUtilActions = () => useUtilStore((state) => state.actions);
