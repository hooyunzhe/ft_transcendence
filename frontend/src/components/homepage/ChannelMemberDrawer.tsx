'use client';
import { Box, Drawer } from '@mui/material';
import Image from 'next/image';
import { ChannelMemberList } from '../channel-member/ChannelMemberList';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import {
  useChannelMemberDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useEffect } from 'react';

export default function ChannelMemberDrawer() {
  const selectedChannel = useSelectedChannel();
  const channelMemberDrawerToggle = useChannelMemberDrawerToggle();
  const { handleDrawerMouseLeave, handleDrawerMouseOver } = useUtilActions();
  const { setChannelMemberDrawerOpen, setChannelMemberDrawerClose } =
    useUtilActions();

  useEffect(() => {
    if (selectedChannel) {
      if (channelMemberDrawerToggle) {
        setChannelMemberDrawerClose();
        setTimeout(() => setChannelMemberDrawerOpen(), 500);
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
        src='/ball/paddle1.png'
        width={12}
        height={110}
        alt='Paddle 2'
      ></Image>
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
            // background: '#3A0CA375',
          },
        }}
        variant='persistent'
        anchor='right'
        open={channelMemberDrawerToggle ? true : false}
      >
        <ChannelMemberList />
      </Drawer>
    </Box>
  );
}
