'use client';
import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
import { ChannelList } from '@/components/channel/ChannelList';
import FriendList from '@/components/friend/FriendList';
import { useUser } from '@/lib/stores/useUserStore';

export default function Cyberpong() {
  const user = useUser();

  return (
    <>
      {/* <ChannelMemberList></ChannelMemberList> */}
      {/* <ChannelList></ChannelList> */}
      {/* <FriendList></FriendList> */}
      <h1>Cyberpong™</h1>
    </>
  );
}
