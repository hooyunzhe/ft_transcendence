import { io } from 'socket.io-client';

<<<<<<< HEAD
export const gameSocket = io(
  `http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/gateway/game`,
  {
    autoConnect: false,
  },
);
=======
export const friendsSocket = io('http://localhost:4242/gateway/friends', {
  query: { id: 4 },
});

export const gameSocket = io('http://localhost:4242/gateway/game');

export const channelMemberSocket = io('http://localhost:4242/gateway/channel_members', {
  query: {
    id: 1,
  }});

// friends_socket.on('newConnection', (data) => {
//   console.log(data);
// });
// friends_socket.on('newDisconnect', (data) => {
//   console.log(data);
// });
// friends_socket.emit('checkStatus', { user_ids: [1, 2, 3, 5] }, (data: any) => {
//   console.log(data);
// });
>>>>>>> 47abc119b3eb50e5874a2010d07e291fce0dacb5
