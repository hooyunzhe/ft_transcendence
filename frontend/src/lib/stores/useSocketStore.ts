import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface SocketStore {
  data: {
    userSocket: Socket;
    friendSocket: Socket;
  };
  // actions: {};
}

const useSocketStore = create<SocketStore>()((set) => ({
  data: {
    userSocket: io('http://localhost:4242/gateway/users', {
      autoConnect: false,
    }),
    friendSocket: io('http://localhost:4242/gateway/friends', {
      autoConnect: false,
    }),
  },
}));

export const useUserSocket = () =>
  useSocketStore((state) => state.data.userSocket);
export const useFriendSocket = () =>
  useSocketStore((state) => state.data.friendSocket);
