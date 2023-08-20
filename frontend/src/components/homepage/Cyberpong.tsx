'use client';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import NavigationHeader from './NavigationHeader';
import MainArea from './MainArea';
import DialogPrompt from '../utils/DialogPrompt';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import NotificationBar from '../utils/NotificationBar';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import {
  useChannelSocket,
  useFriendSocket,
  useSocketActions,
  useUserSocket,
} from '@/lib/stores/useSocketStore';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import {
  useChannelActions,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';

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
  const { getProfileData } = useProfileActions();
  const { getGameData } = useGameActions();
  const { getAchievementData } = useAchievementActions();
  const { setupNotificationSocketEvents } = useNotificationActions();
  const { setupUtilSocketEvents } = useUtilActions();

  useEffect(() => {
    initSockets(currentUser.id);
    getFriendData(currentUser.id);
    getChannelData(currentUser.id);
    getGameData(currentUser.id);
    getAchievementData(currentUser.id);
    getChannelMemberData();
    getChatData();
    getProfileData();

    return () => {
      resetSockets();
    };
  }, []);

  useEffect(() => {
    if (userSocket) {
      addUserStatus(
        userSocket,
        friends.map((friend) => friend.incoming_friend.id),
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
      setupUtilSocketEvents(friendSocket);
    }
  }, [friendSocket]);

  useEffect(() => {
    if (channelSocket) {
      setupChannelSocketEvents(channelSocket, currentUser.id);
      setupChannelMemberSocketEvents(channelSocket, currentUser.id);
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
      <DialogPrompt />
      <ConfirmationPrompt />
      <NotificationBar />
    </Box>
  );
}
