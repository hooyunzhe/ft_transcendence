import Bar from '@/components/Bar';
import Chat from '@/components/Chat';
import ChatBox from '@/components/ChatBox';
export default function Home() {
  // // @ts-expect-error Server Component
  return (
    <div>
      <Bar></Bar>
      <ChatBox messageAPI='messages'></ChatBox>
    </div>
  );
  // return <FriendList API={'friends'}></FriendList>;
}
