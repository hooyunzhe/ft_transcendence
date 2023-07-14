'use client';
import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
import { ChannelList } from '@/components/channel/ChannelList';
import FriendList from '@/components/friend/FriendList';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import { useFriendSocket, useUserSocket } from '@/lib/stores/useSocketStore';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useEffect } from 'react';
import NotificationBar from './utils/NotificationBar';
import {
  useNotification,
  useNotificationActions,
} from '@/lib/stores/useNotificationStore';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const { setupUserSocketEvents } = useUserActions();
  const { setupFriendSocketEvents } = useFriendActions();
  const notification = useNotification();
  const { resetNotification, setupNotificationSocketEvents } =
    useNotificationActions();

  useEffect(() => {
    setupUserSocketEvents(userSocket, currentUser.id);
    setupFriendSocketEvents(friendSocket, currentUser.id);
    setupNotificationSocketEvents(friendSocket);
    userSocket.connect();
    friendSocket.connect();

    return () => {
      userSocket.removeAllListeners();
      friendSocket.removeAllListeners();
    };
  }, []);

  return (
    <>
      {/* <ChannelMemberList></ChannelMemberList> */}
      {/* <ChannelList></ChannelList> */}
      <FriendList></FriendList>
      {/* <h1>Cyberpong™</h1> */}
      <NotificationBar
        display={notification.display}
        level={notification.level}
        message={notification.message}
        onCloseHandler={resetNotification}
      />
    </>
  );
}
