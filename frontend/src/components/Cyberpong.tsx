'use client';
import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
import { ChannelList } from '@/components/channel/ChannelList';
import FriendList from '@/components/friend/FriendList';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import { useFriendSocket, useUserSocket } from '@/lib/stores/useSocketStore';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useEffect } from 'react';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const { setupUserSocket, resetUserSocket } = useUserActions();
  const { setupFriendSocket, resetFriendSocket } = useFriendActions();

  useEffect(() => {
    setupUserSocket(userSocket, currentUser.id);
    setupFriendSocket(friendSocket, currentUser.id);
    userSocket.connect();
    friendSocket.connect();

    return () => {
      resetUserSocket(userSocket);
      resetFriendSocket(friendSocket);
    };
  }, []);

  return (
    <>
      {/* <ChannelMemberList></ChannelMemberList> */}
      {/* <ChannelList></ChannelList> */}
      <FriendList></FriendList>
      {/* <h1>Cyberpong™</h1> */}
    </>
  );
}
