import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { FriendCategory, SocialTab, View } from '@/types/UtilTypes';

interface UtilStore {
  data: {
    currentView: View | false;
    currentSocialTab: SocialTab;
    currentFriendCategory: FriendCategory | undefined;
    socialDrawerToggle: boolean;
    channelMemberDrawerToggle: boolean;
    drawerTimeoutID: NodeJS.Timeout | undefined;
  };
  actions: {
    setCurrentView: (newView: View | false) => void;
    changeCurrentView: (newView: View | false) => void;
    setCurrentSocialTab: (newTab: SocialTab) => void;
    setCurrentFriendCategory: (newCategory: FriendCategory | undefined) => void;
    setSocialDrawerOpen: () => void;
    setSocialDrawerClose: () => void;
    setChannelMemberDrawerOpen: () => void;
    setChannelMemberDrawerClose: () => void;
    handleDrawerMouseOver: (channelSelected: boolean) => void;
    handleDrawerMouseLeave: () => void;
    setupUtilSocketEvents: (friendSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: UtilStore) => Partial<UtilStore>) => void;
type StoreGetter = () => UtilStore;

function setCurrentView(set: StoreSetter, newView: View | false): void {
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
  newView: View | false,
): void {
  if (get().data.currentView === newView) {
    setCurrentView(set, false);
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

function setCurrentFriendCategory(
  set: StoreSetter,
  newCategory: FriendCategory | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      currentFriendCategory: newCategory,
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

function setupFriendSocketEvents(set: StoreSetter, friendSocket: Socket): void {
  friendSocket.on('newRequest', () =>
    setCurrentFriendCategory(set, FriendCategory.PENDING),
  );
  friendSocket.on('acceptRequest', () =>
    setCurrentFriendCategory(set, FriendCategory.FRIENDS),
  );
}

const useUtilStore = create<UtilStore>()((set, get) => ({
  data: {
    currentView: false,
    currentSocialTab: SocialTab.FRIEND,
    currentFriendCategory: FriendCategory.FRIENDS,
    channelMemberDrawerToggle: false,
    socialDrawerToggle: false,
    drawerTimeoutID: undefined,
    channelSelected: false,
  },
  actions: {
    setCurrentView: (newView) => setCurrentView(set, newView),
    changeCurrentView: (newView) => changeCurrentView(set, get, newView),
    setCurrentSocialTab: (newTab) => setCurrentSocialTab(set, newTab),
    setCurrentFriendCategory: (newCategory) =>
      setCurrentFriendCategory(set, newCategory),
    setSocialDrawerOpen: () => setSocialDrawerOpen(set),
    setSocialDrawerClose: () => setSocialDrawerClose(set),
    setChannelMemberDrawerOpen: () => setChannelMemberDrawerOpen(set),
    setChannelMemberDrawerClose: () => setChannelMemberDrawerClose(set),
    handleDrawerMouseOver: (channelSelected) =>
      handleDrawerMouseOver(set, get, channelSelected),
    handleDrawerMouseLeave: () => handleDrawerMouseLeave(set),
    setupUtilSocketEvents: (friendSocket) =>
      setupFriendSocketEvents(set, friendSocket),
  },
}));

export const useCurrentView = () =>
  useUtilStore((state) => state.data.currentView);
export const useCurrentSocialTab = () =>
  useUtilStore((state) => state.data.currentSocialTab);
export const useCurrentFriendCategory = () =>
  useUtilStore((state) => state.data.currentFriendCategory);
export const useChannelMemberDrawerToggle = () =>
  useUtilStore((state) => state.data.channelMemberDrawerToggle);
export const useSocialDrawerToggle = () =>
  useUtilStore((state) => state.data.socialDrawerToggle);
export const useUtilActions = () => useUtilStore((state) => state.actions);
