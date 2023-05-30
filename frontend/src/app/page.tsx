'use client';
import Bar from '@/components/Bar';
import Chat from '@/components/Chat';
import ChatBox from '@/components/ChatBox';
import { MessageSharp } from '@mui/icons-material';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
export default function Home() {
  // // @ts-expect-error Server Component
  const socket = io('http://localhost:4242/gateway/messages', {
    query: {
      id: 1,
    },
  });

  socket.on('Yes', (data) => {
    console.log('Yes received from server!');
    console.log(`You are connected with id ${socket.id}`);
    console.log(data);
  });

  useEffect(() => {
    socket.emit('test', (data: any) => {
      console.log('test sent to server!');
      console.log(data);
    });
  }, []);

  return (
    <div>
      <Bar></Bar>
      <ChatBox messageAPI='messages'></ChatBox>
    </div>
  );
}
