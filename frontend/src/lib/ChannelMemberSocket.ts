import { io } from 'socket.io-client';

export const channelMemberSocket = io('http://localhost:4242/gateway/channel_members.service', {
  query: {
    id: 1,
  },
});