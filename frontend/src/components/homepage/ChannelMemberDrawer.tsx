'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Drawer } from '@mui/material';
import { ChannelMemberList } from '../channel-member/ChannelMemberList';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import {
  useChannelMemberDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';

export default function ChannelMemberDrawer() {
  const selectedChannel = useSelectedChannel();
  const channelMemberDrawerToggle = useChannelMemberDrawerToggle();
  const { handleDrawerMouseLeave, handleDrawerMouseOver } = useUtilActions();
  const { setChannelMemberDrawerOpen, setChannelMemberDrawerClose } =
    useUtilActions();
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
        open={channelMemberDrawerToggle}
      >
        <ChannelMemberList />
      </Drawer>
    </Box>
  );
}
