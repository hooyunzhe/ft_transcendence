'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import FriendList from '../friend/FriendList';
import { ChannelList } from '../channel/ChannelList';
import { useState } from 'react';
import Image from 'next/image';
import {
  useChannelMemberDrawerToggle,
  useSocialDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';

export default function SocialDrawer() {
  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>();
  const [selectedTab, setSelectedTab] = useState(0);
  const {
    setSocialDrawerClose,
    setSocialDrawerOpen,
    setChannelMemberDrawerClose,
  } = useUtilActions();
  const socialDrawerToggle = useSocialDrawerToggle();
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      onMouseOver={() => {
        if (selectedChannel) clearTimeout(timeoutID);
        setSocialDrawerOpen();
      }}
      onMouseLeave={() => {
        setTimeoutID(
          setTimeout(() => {
            setSocialDrawerClose();
            setChannelMemberDrawerClose();
          }, 2000),
        );
      }}
    >
      <Image
        src='/ball/paddle2.png'
        width={12}
        height={110}
        alt='Paddle 1'
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
            borderRadius: '0 15px 15px 0',
            // background: '#3A0CA375',
          },
        }}
        variant='persistent'
        anchor='left'
        open={socialDrawerToggle}
      >
        <Tabs
          sx={{
            margin: '3px',
          }}
          variant='fullWidth'
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
        >
          <Tab label='Friends' />
          <Tab label='Channels' />
        </Tabs>
        {selectedTab === 0 && <FriendList />}
        {selectedTab === 1 && <ChannelList />}
      </Drawer>
    </Box>
  );
}
