import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface SocketStore {
  data: {
    userSocket: Socket | null;
    friendSocket: Socket | null;
    channelSocket: Socket | null;
    gameSocket: Socket | null;
  };
  actions: {
    initSockets: (userID: number) => void;
    resetSockets: () => void;
  };
}

type StoreSetter = (partialState: Partial<SocketStore>) => void;
type StoreGetter = () => SocketStore;

function initSockets(set: StoreSetter, userID: number): void {
  const userSocket = io(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/gateway/user',
  );
  const friendSocket = io(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/gateway/friend',
  );
  const channelSocket = io(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/gateway/channel',
  );
  const gameSocket = io(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/gateway/game',
  );

  userSocket.emit('initConnection', userID);
  friendSocket.emit('initConnection', userID);
  channelSocket.emit('initConnection', userID);
  set({
    data: {
      userSocket: userSocket,
      friendSocket: friendSocket,
      channelSocket: channelSocket,
      gameSocket: gameSocket,
    },
  });
}

function resetSockets(set: StoreSetter, get: StoreGetter): void {
  const sockets = get().data;

  sockets.userSocket?.disconnect();
  sockets.friendSocket?.disconnect();
  sockets.channelSocket?.disconnect();
  sockets.gameSocket?.disconnect();
  set({
    data: {
      userSocket: null,
      friendSocket: null,
      channelSocket: null,
      gameSocket: null,
    },
  });
}

const useSocketStore = create<SocketStore>()((set, get) => ({
  data: {
    userSocket: null,
    friendSocket: null,
    channelSocket: null,
    gameSocket: null,
  },
  actions: {
    initSockets: (userID) => initSockets(set, userID),
    resetSockets: () => resetSockets(set, get),
  },
}));

export const useUserSocket = () =>
  useSocketStore((state) => state.data.userSocket);
export const useFriendSocket = () =>
  useSocketStore((state) => state.data.friendSocket);
export const useChannelSocket = () =>
  useSocketStore((state) => state.data.channelSocket);
export const useGameSocket = () =>
  useSocketStore((state) => state.data.gameSocket);
export const useSocketActions = () => useSocketStore((state) => state.actions);
