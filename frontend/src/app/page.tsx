import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
import { ChannelList } from '@/components/channel/ChannelList';
import FriendList from '@/components/friend/FriendList';
export default function Home() {
  return (
    <>
      <ChannelMemberList></ChannelMemberList>

      {/* <ChannelList></ChannelList>
      <FriendList></FriendList> */}
    </>
  );
}
