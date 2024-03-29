'use client';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import Logo from './Logo';
import NavigationHeader from './NavigationHeader';
import MainArea from './MainArea';
import TwoFactorPrompt from '../utils/TwoFactorPrompt';
import DialogPrompt from '../utils/DialogPrompt';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import NotificationBar from '../utils/NotificationBar';
import BackdropOverlay from '../utils/BackdropOverlay';
import GameNewInvite from '../game/overlay/GameNewInvite';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import {
  useChannelSocket,
  useFriendSocket,
  useGameSocket,
  useSocketActions,
  useUserSocket,
} from '@/lib/stores/useSocketStore';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import {
  useFriendActions,
  useFriendChecks,
  useFriends,
} from '@/lib/stores/useFriendStore';
import {
  useChannelActions,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import GameMatchFound from '../game/overlay/GameMatchFound';
import GameDisconnected from '../game/overlay/GameDisconnected';
import { MatchState } from '@/types/GameTypes';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const channelSocket = useChannelSocket();
  const gameSocket = useGameSocket();
  const friends = useFriends();
  const joinedChannels = useJoinedChannels();
  const matchState = useMatchState();
  const { initSockets, resetSockets } = useSocketActions();
  const { getGameData, setupGameSocketEvents } = useGameActions();
  const {
    getFriendData,
    setupFriendSocketEvents,
    setupFriendUserSocketEvents,
  } = useFriendActions();
  const { isFriendBlocked } = useFriendChecks();
  const {
    getChannelData,
    setupChannelSocketEvents,
    setupChannelFriendSocketEvents,
    setupChannelUserSocketEvents,
  } = useChannelActions();
  const { getChatData, setupChatSocketEvents } = useChatActions();
  const { getAchievementData } = useAchievementActions();
  const {
    getChannelMemberData,
    setupChannelMemberSocketEvents,
    setupChannelMemberUserSocketEvents,
  } = useChannelMemberActions();
  const { getProfileData, setupProfileUserSocketEvents } = useProfileActions();
  const { addUserStatus, setupUserSocketEvents } = useUserActions();
  const {
    setupNotificationFriendSocketEvents,
    setupNotificationChannelSocketEvents,
    setupNotificationGameSocketEvents,
  } = useNotificationActions();
  const { setupBackdropSocketEvents } = useBackdropActions();
  const { setupUtilFriendSocketEvents, setupUtilGameSocketEvents } =
    useUtilActions();

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

    return () => resetSockets();
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
      if (matchState === MatchState.IDLE) {
        userSocket.emit('leaveGame');
      } else {
        userSocket.emit('joinGame');
      }
    }
  }, [matchState]);

  useEffect(() => {
    if (userSocket) {
      setupUserSocketEvents(userSocket);
      setupFriendUserSocketEvents(userSocket);
      setupChannelUserSocketEvents(userSocket, currentUser.id);
      setupChannelMemberUserSocketEvents(userSocket);
      setupProfileUserSocketEvents(userSocket);
    }
  }, [userSocket]);

  useEffect(() => {
    if (friendSocket) {
      setupFriendSocketEvents(friendSocket);
      setupChannelFriendSocketEvents(friendSocket, currentUser.id);
      setupNotificationFriendSocketEvents(friendSocket);
      setupUtilFriendSocketEvents(friendSocket);
    }
  }, [friendSocket]);

  useEffect(() => {
    if (channelSocket) {
      setupChannelSocketEvents(channelSocket, currentUser.id);
      setupChannelMemberSocketEvents(channelSocket, currentUser.id);
      setupChatSocketEvents(channelSocket);
      setupNotificationChannelSocketEvents(
        channelSocket,
        currentUser.id,
        isFriendBlocked,
      );
    }
  }, [channelSocket]);

  useEffect(() => {
    if (gameSocket) {
      setupGameSocketEvents(gameSocket);
      setupNotificationGameSocketEvents(gameSocket, isFriendBlocked);
      setupBackdropSocketEvents(
        gameSocket,
        <GameNewInvite />,
        <GameMatchFound />,
        <GameDisconnected isCurrentUser={false} />,
        <GameDisconnected isCurrentUser={true} />,
        isFriendBlocked,
        currentUser,
      );
      setupUtilGameSocketEvents(gameSocket);
    }
  }, [gameSocket]);

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
      <Logo />
      <NavigationHeader />
      <MainArea />
      <TwoFactorPrompt />
      <DialogPrompt />
      <ConfirmationPrompt />
      <NotificationBar />
      <BackdropOverlay />
    </Box>
  );
}
