import { io } from 'socket.io-client';

export const friends_socket = io('http://localhost:4242/gateway/friends', {
  query: { id: 4 },
});

// friends_socket.on('newConnection', (data) => {
//   console.log(data);
// });
// friends_socket.on('newDisconnect', (data) => {
//   console.log(data);
// });
// friends_socket.emit('checkStatus', { user_ids: [1, 2, 3, 5] }, (data: any) => {
//   console.log(data);
// });
