'use client';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import NavigationHeader from './NavigationHeader';
import MainArea from './MainArea';
import TwoFactorPrompt from '../utils/TwoFactorPrompt';
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
import { useGameActions } from '@/lib/stores/useGameStore';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import {
  useChannelActions,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const channelSocket = useChannelSocket();
  const friends = useFriends();
  const joinedChannels = useJoinedChannels();
  const { initSockets, resetSockets } = useSocketActions();
  const { getGameData } = useGameActions();
  const { getFriendData, setupFriendSocketEvents } = useFriendActions();
  const { getChannelData, setupChannelSocketEvents } = useChannelActions();
  const { getChatData, setupChatSocketEvents } = useChatActions();
  const { getAchievementData } = useAchievementActions();
  const { getChannelMemberData, setupChannelMemberSocketEvents } =
    useChannelMemberActions();
  const { getProfileData } = useProfileActions();
  const { addUserStatus, setupUserSocketEvents } = useUserActions();
  const { setupNotificationSocketEvents } = useNotificationActions();
  const { setupUtilSocketEvents } = useUtilActions();

  useEffect(() => {
    initSockets(currentUser.id);
    getGameData(currentUser.id);
    getFriendData(currentUser.id);
    getChannelData(currentUser.id);
    getGameData(currentUser.id);
    getChatData(currentUser.id);
    getAchievementData(currentUser.id);
    getChannelMemberData();
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
        borderRadius: '15px',
      }}
    >
      <video
        width='100%'
        height='100%'
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          zIndex: -1,
          objectFit: 'cover',
        }}
      >
        <source src='/assets/background1.mp4' type='video/mp4' />
      </video>
      <NavigationHeader />
      <MainArea />
      <TwoFactorPrompt />
      <DialogPrompt />
      <ConfirmationPrompt />
      <NotificationBar />
    </Box>
  );
}
