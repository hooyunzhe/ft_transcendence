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
    showSocialPaddle: boolean;
    showChannelMemberPaddle: boolean;
    paddleTimeoutID: NodeJS.Timeout | undefined;
    isPromptOpen: boolean;
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
    handleDrawerMouseEnter: (channelSelected: boolean) => void;
    handleDrawerMouseLeave: () => void;
    setShowSocialPaddle: (show: boolean) => void;
    setShowChannelMemberPaddle: (show: boolean) => void;
    setIsPromptOpen: (open: boolean) => void;
    setupUtilFriendSocketEvents: (friendSocket: Socket) => void;
    setupUtilGameSocketEvents: (gameSocket: Socket) => void;
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

function setChannelMemberDrawerOpen(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      channelMemberDrawerToggle: true,
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

function handleDrawerMouseEnter(
  set: StoreSetter,
  get: StoreGetter,
  channelSelected: boolean,
): void {
  clearTimeout(get().data.drawerTimeoutID);
  clearTimeout(get().data.paddleTimeoutID);
  setSocialDrawerOpen(set);
  setShowSocialPaddle(set, false);
  if (channelSelected && !get().data.socialDrawerToggle) {
    setChannelMemberDrawerOpen(set);
    setShowChannelMemberPaddle(set, false);
  }
}

function handleDrawerMouseLeave(set: StoreSetter): void {
  set(({ data }) => ({
    data: {
      ...data,
      drawerTimeoutID: data.isPromptOpen
        ? data.drawerTimeoutID
        : setTimeout(() => {
            setSocialDrawerClose(set);
            setChannelMemberDrawerClose(set);
          }, 2000),
      paddleTimeoutID: data.isPromptOpen
        ? data.paddleTimeoutID
        : setTimeout(() => {
            setShowSocialPaddle(set, true);
            setShowChannelMemberPaddle(set, true);
          }, 2500),
    },
  }));
}

function setShowSocialPaddle(set: StoreSetter, show: boolean): void {
  set(({ data }) => ({
    data: {
      ...data,
      showSocialPaddle: show,
    },
  }));
}

function setShowChannelMemberPaddle(set: StoreSetter, show: boolean): void {
  set(({ data }) => ({
    data: {
      ...data,
      showChannelMemberPaddle: show,
    },
  }));
}

function setIsPromptOpen(
  set: StoreSetter,
  get: StoreGetter,
  open: boolean,
): void {
  clearTimeout(get().data.drawerTimeoutID);
  clearTimeout(get().data.paddleTimeoutID);
  set(({ data }) => ({
    data: {
      ...data,
      isPromptOpen: open,
    },
  }));
  if (!open) {
    handleDrawerMouseLeave(set);
  }
}

function setupUtilFriendSocketEvents(
  set: StoreSetter,
  friendSocket: Socket,
): void {
  friendSocket.on('newRequest', () => {
    setCurrentFriendCategory(set, FriendCategory.PENDING);
    setSocialDrawerOpen(set);
  });
  friendSocket.on('acceptRequest', () => {
    setCurrentFriendCategory(set, FriendCategory.FRIENDS);
    setSocialDrawerOpen(set);
  });
}

function setupUtilGameSocketEvents(set: StoreSetter, gameSocket: Socket): void {
  gameSocket.on('matchFound', () => setCurrentView(set, View.GAME));
}

const useUtilStore = create<UtilStore>()((set, get) => ({
  data: {
    currentView: View.GAME,
    currentSocialTab: SocialTab.FRIEND,
    currentFriendCategory: FriendCategory.FRIENDS,
    socialDrawerToggle: false,
    channelMemberDrawerToggle: false,
    drawerTimeoutID: undefined,
    showSocialPaddle: false,
    showChannelMemberPaddle: true,
    paddleTimeoutID: undefined,
    isPromptOpen: false,
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
    handleDrawerMouseEnter: (channelSelected) =>
      handleDrawerMouseEnter(set, get, channelSelected),
    handleDrawerMouseLeave: () => handleDrawerMouseLeave(set),
    setShowSocialPaddle: (show) => setShowSocialPaddle(set, show),
    setShowChannelMemberPaddle: (show) => setShowChannelMemberPaddle(set, show),
    setIsPromptOpen: (open) => setIsPromptOpen(set, get, open),
    setupUtilFriendSocketEvents: (friendSocket) =>
      setupUtilFriendSocketEvents(set, friendSocket),
    setupUtilGameSocketEvents: (gameSocket) =>
      setupUtilGameSocketEvents(set, gameSocket),
  },
}));

export const useCurrentView = () =>
  useUtilStore((state) => state.data.currentView);
export const useCurrentSocialTab = () =>
  useUtilStore((state) => state.data.currentSocialTab);
export const useCurrentFriendCategory = () =>
  useUtilStore((state) => state.data.currentFriendCategory);
export const useSocialDrawerToggle = () =>
  useUtilStore((state) => state.data.socialDrawerToggle);
export const useShowSocialPaddle = () =>
  useUtilStore((state) => state.data.showSocialPaddle);
export const useShowChannelMemberPaddle = () =>
  useUtilStore((state) => state.data.showChannelMemberPaddle);
export const useChannelMemberDrawerToggle = () =>
  useUtilStore((state) => state.data.channelMemberDrawerToggle);
export const useUtilActions = () => useUtilStore((state) => state.actions);
