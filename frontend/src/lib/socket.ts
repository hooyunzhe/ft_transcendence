import { io } from 'socket.io-client';

export const gameSocket = io(
  `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game`,
  {
    autoConnect: false,
  },
);
