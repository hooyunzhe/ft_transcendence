import { io } from 'socket.io-client';

export const messageSocket = io('http://localhost:4242/gateway/messages', {
  query: {
    id: 1,
  },
});
