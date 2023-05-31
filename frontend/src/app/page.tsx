'use client';
import Bar from '@/components/Bar';
import ChatBox from '@/components/ChatBox';
export default function Home() {
  return (
    <div>
      <Bar></Bar>
      <ChatBox messageAPI='messages'></ChatBox>
    </div>
  );
}
