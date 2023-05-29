import { FriendList } from '@/components/FriendList';
import { io } from 'socket.io-client';

export default function Home() {
  // return <FriendList API={'friends'}></FriendList>;

  const socket = io('http://localhost:4242/gateway/friends', {
    query: {
      id: 1,
    },
  });

  socket.on('newConnection', (data) => {
    console.log(data);
  });

  socket.emit('checkStatus', (data: any) => {
    console.log(data);
  });
}
