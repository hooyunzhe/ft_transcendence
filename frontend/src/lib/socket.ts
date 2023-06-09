import { io } from 'socket.io-client';

export const gameSocket = io('http://localhost:4242/gateway/game', {
  autoConnect: false,
});
