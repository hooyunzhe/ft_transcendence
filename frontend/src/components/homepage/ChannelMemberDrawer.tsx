'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Drawer } from '@mui/material';
import ToolbarHeader from '../utils/ToolbarHeader';
import ChannelMemberList from '../channel-member/ChannelMemberList';
import {
  useChannelMemberDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { useMatchState } from '@/lib/stores/useGameStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { MatchState } from '@/types/GameTypes';
import { ChannelType } from '@/types/ChannelTypes';
import { ToolbarHeaderType } from '@/types/UtilTypes';

export default function ChannelMemberDrawer() {
  const channelMemberDrawerToggle = useChannelMemberDrawerToggle();
  const currentPreference = useCurrentPreference();
  const matchState = useMatchState();
  const selectedChannel = useSelectedChannel();
  const {
    setChannelMemberDrawerOpen,
    setChannelMemberDrawerClose,
    handleDrawerMouseLeave,
    handleDrawerMouseOver,
  } = useUtilActions();
  const [toggleTimeoutID, setToggleTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    clearTimeout(toggleTimeoutID);
    if (selectedChannel) {
      if (channelMemberDrawerToggle) {
        setChannelMemberDrawerClose();
        setToggleTimeoutID(setTimeout(() => setChannelMemberDrawerOpen(), 500));
      } else {
        setChannelMemberDrawerOpen();
      }
    } else {
      setChannelMemberDrawerClose();
    }
  }, [selectedChannel]);

  return (
    <Box
      onMouseOver={() => {
        if (selectedChannel) {
          handleDrawerMouseOver(true);
        }
      }}
      onMouseLeave={handleDrawerMouseLeave}
    >
      <Image
        src='/assets/bluepaddle.png'
        width={12}
        height={109}
        alt='Paddle 2'
      />
      <Drawer
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            height: '70vh',
            top: '15vh',
            border: 'solid 5px #7209B775',
            borderRadius: '15px 0 0 15px',
            bgcolor: '#00000000',
          },
        }}
        variant='persistent'
        anchor='right'
        open={
          matchState !== MatchState.INGAME &&
          (channelMemberDrawerToggle || !currentPreference.animations_enabled)
        }
      >
        <ToolbarHeader
          title={
            !selectedChannel
              ? ''
              : selectedChannel.type === ChannelType.DIRECT
              ? 'Direct Message'
              : 'Members'
          }
          type={
            !selectedChannel
              ? ToolbarHeaderType.NONE
              : selectedChannel.type === ChannelType.DIRECT
              ? ToolbarHeaderType.DIRECT_MESSAGE
              : ToolbarHeaderType.CHANNEL_MEMBER
          }
        />
        <ChannelMemberList />
      </Drawer>
    </Box>
  );
}
