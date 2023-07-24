import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface SocketStore {
  data: {
    userSocket: Socket | null;
    friendSocket: Socket | null;
    channelMemberSocket: Socket | null;
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
  const userSocket = io('http://localhost:4242/gateway/users');
  const friendSocket = io('http://localhost:4242/gateway/friends');
  const channelMemberSocket = io('http://localhost:4242/gateway/channelMembers');
  const channelSocket = io('http://localhost:4242/gateway/channels');

  userSocket.emit('initConnection', { user_id: userID });
  friendSocket.emit('initConnection', { user_id: userID });
  set({ data: { userSocket: userSocket,
                friendSocket: friendSocket,
                channelSocket : channelSocket,
                channelMemberSocket: channelMemberSocket } });
}

function resetSockets(set: StoreSetter, get: StoreGetter): void {
  const sockets = get().data;

  sockets.userSocket?.disconnect();
  sockets.friendSocket?.disconnect();
  set({
    data: {
      userSocket: null,
      friendSocket: null,
      channelMemberSocket: null,
      channelSocket: null,
    },
  });
}

const useSocketStore = create<SocketStore>()((set, get) => ({
  data: {
    userSocket: null,
    friendSocket: null,
    channelMemberSocket: null,
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
export const useChannelMemberSocket = () => 
  useSocketStore((state) => state.data.channelMemberSocket);
export const useSocketActions = () => useSocketStore((state) => state.actions);
