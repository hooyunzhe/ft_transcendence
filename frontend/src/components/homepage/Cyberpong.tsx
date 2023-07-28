'use client';
import { useFriendActions } from '@/lib/stores/useFriendStore';
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
import {
  useConfirmation,
  useConfirmationActions,
} from '@/lib/stores/useConfirmationStore';
import {
  useNotification,
  useNotificationActions,
} from '@/lib/stores/useNotificationStore';
import SocialDrawer from './SocialDrawer';
import { Box } from '@mui/material';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import NavigationHeader from './NavigationHeader';
import MainArea from './MainArea';
import { useChatActions } from '@/lib/stores/useChatStore';
import ChannelMemberDrawer from './ChannelMemberDrawer';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const channelSocket = useChannelSocket();
  const { initSockets, resetSockets } = useSocketActions();
  const { setupUserSocketEvents } = useUserActions();
  const { getFriendData, setupFriendSocketEvents } = useFriendActions();
  const { getChannelData, setupChannelSocketEvents } = useChannelActions();
  const { getChannelMemberData, setupChannelMemberSocketEvents } =
    useChannelMemberActions();
  const { getChatData, setupChatSocketEvents } = useChatActions();
  const confirmation = useConfirmation();
  const { resetConfirmation } = useConfirmationActions();
  const notification = useNotification();
  const { resetNotification, setupNotificationSocketEvents } =
    useNotificationActions();

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
      <SocialDrawer />
      <ChannelMemberDrawer />
      <ConfirmationPrompt
        open={confirmation.required}
        onCloseHandler={resetConfirmation}
        promptTitle={confirmation.title}
        promptDescription={confirmation.description}
        handleAction={() => {
          confirmation.handleAction(confirmation.arg);
          resetConfirmation();
        }}
      />
      <NotificationBar
        display={notification.display}
        level={notification.level}
        message={notification.message}
        onCloseHandler={resetNotification}
      />
    </Box>
  );
}
