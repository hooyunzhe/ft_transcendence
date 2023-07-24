'use client';
import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import {
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
import Image from 'next/image';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import NavigationHeader from './NavigationHeader';

export default function Cyberpong() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const { initSockets, resetSockets } = useSocketActions();
  const { setupUserSocketEvents } = useUserActions();
  const { getFriendData, setupFriendSocketEvents } = useFriendActions();
  const { getChannelData } = useChannelActions();
  const { getChannelMemberData } = useChannelMemberActions();
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        alignSelf: 'stretch',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: '5px',
        borderRadius: '10px',
        background: '#4CC9F0',
      }}
    >
      <NavigationHeader />
      <SocialDrawer />
      <Image
        src='/ball/paddle1.png'
        width={12}
        height={110}
        alt='Paddle 1'
      ></Image>
      {/* <ChannelMemberList></ChannelMemberList> */}
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
