'use client';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import {
  useChannelSocket,
  useFriendSocket,
  useSocketActions,
  useUserSocket,
} from '@/lib/stores/useSocketStore';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useEffect } from 'react';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import NotificationBar from '../utils/NotificationBar';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { Box } from '@mui/material';
import {
  useChannelActions,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import NavigationHeader from './NavigationHeader';
import MainArea from './MainArea';
import { useChatActions } from '@/lib/stores/useChatStore';
import { Friend } from '@/types/FriendTypes';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const channelSocket = useChannelSocket();
  const { initSockets, resetSockets } = useSocketActions();
  const { addUserStatus, setupUserSocketEvents } = useUserActions();
  const friends = useFriends();
  const { getFriendData, setupFriendSocketEvents } = useFriendActions();
  const { getChannelData, setupChannelSocketEvents } = useChannelActions();
  const { getChannelMemberData, setupChannelMemberSocketEvents } =
    useChannelMemberActions();
  const joinedChannels = useJoinedChannels();
  const { getChatData, setupChatSocketEvents } = useChatActions();
  const { setupNotificationSocketEvents } = useNotificationActions();

  useEffect(() => {
    initSockets(currentUser.id);
    getFriendData(currentUser.id);
    getChannelData(currentUser.id);
    getChannelMemberData();
    getChatData();

    return () => {
      resetSockets();
    };
  }, []);

  useEffect(() => {
    if (userSocket) {
      addUserStatus(
        userSocket,
        friends.map((friend: Friend) => friend.incoming_friend.id),
      );
    }
  }, [friends.length]);

  useEffect(() => {
    if (channelSocket) {
      joinedChannels.forEach((joined, index) => {
        if (joined) {
          channelSocket.emit('joinRoom', index);
        }
      });
    }
  }, [joinedChannels.length]);

  useEffect(() => {
    if (userSocket) {
      setupUserSocketEvents(userSocket);
    }
  }, [userSocket]);

  useEffect(() => {
    if (friendSocket) {
      setupFriendSocketEvents(friendSocket);
      setupNotificationSocketEvents(friendSocket);
    }
  }, [friendSocket]);

  useEffect(() => {
    if (channelSocket) {
      setupChannelSocketEvents(channelSocket);
      setupChannelMemberSocketEvents(channelSocket);
      setupChatSocketEvents(channelSocket);
    }
  }, [channelSocket]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        margin: '5px',
        borderRadius: '15px',
        background: '#4CC9F0',
      }}
    >
      <NavigationHeader />
      <MainArea />
      <ConfirmationPrompt />
      <NotificationBar />
    </Box>
  );
}
