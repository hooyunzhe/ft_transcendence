'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Drawer } from '@mui/material';
import { ChannelMemberList } from '../channel-member/ChannelMemberList';
import {
  useChannelMemberDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';

export default function ChannelMemberDrawer() {
  const channelMemberDrawerToggle = useChannelMemberDrawerToggle();
  const currentPreference = useCurrentPreference();
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
      <Image src='/assets/paddle1.png' width={12} height={110} alt='Paddle 2' />
      <Drawer
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            height: '70vh',
            top: '15vh',
            padding: '7px',
            border: 'solid 5px #7209B775',
            borderRadius: '15px 0 0 15px',
          },
        }}
        variant='persistent'
        anchor='right'
        open={
          channelMemberDrawerToggle || !currentPreference.animations_enabled
        }
      >
        <ChannelMemberList />
      </Drawer>
    </Box>
  );
}
