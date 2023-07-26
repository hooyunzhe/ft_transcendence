import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface SocketStore {
  data: {
    userSocket: Socket | null;
    friendSocket: Socket | null;
    channelSocket: Socket | null;
  };
  actions: {
    initSockets: (userID: number) => void;
    resetSockets: () => void;
  };
}

type StoreSetter = (partialState: Partial<SocketStore>) => void;
type StoreGetter = () => SocketStore;

function initSockets(set: StoreSetter, userID: number): void {
  const userSocket = io('http://localhost:4242/gateway/user');
  const friendSocket = io('http://localhost:4242/gateway/friend');
  const channelSocket = io('http://localhost:4242/gateway/channel');

  userSocket.emit('initConnection', userID);
  friendSocket.emit('initConnection', userID);
  channelSocket.emit('initConnection', userID);
  set({
    data: {
      userSocket: userSocket,
      friendSocket: friendSocket,
      channelSocket: channelSocket,
    },
  });
}

function resetSockets(set: StoreSetter, get: StoreGetter): void {
  const sockets = get().data;

  sockets.userSocket?.disconnect();
  sockets.friendSocket?.disconnect();
  sockets.channelSocket?.disconnect();
  set({
    data: {
      userSocket: null,
      friendSocket: null,
      channelSocket: null,
    },
  });
}

const useSocketStore = create<SocketStore>()((set, get) => ({
  data: {
    userSocket: null,
    friendSocket: null,
    channelSocket: null,
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
export const useSocketActions = () => useSocketStore((state) => state.actions);
