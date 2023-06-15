import FriendList from '@/components/FriendList';
import ChannelHeader from '@/components/ChannelHeader';
import { ChannelList } from '@/components/ChannelList';
export default function Home() {
  return (
    <>
      <ChannelHeader></ChannelHeader>
      <ChannelList></ChannelList>
      {/* <FriendList></FriendList> */}
    </>
  );
}
