'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import FriendList from '../friend/FriendList';
import { ChannelList } from '../channel/ChannelList';
import { useState } from 'react';
import Image from 'next/image';

export default function SocialDrawer() {
  const [open, setOpen] = useState(false);
  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box
      sx={{
        marginRight: 'auto',
      }}
      onMouseOver={() => {
        clearInterval(timeoutID);
        setOpen(true);
      }}
      onMouseLeave={() => {
        setTimeoutID(setTimeout(() => setOpen(false), 5000));
      }}
    >
      {!open && (
        <Image
          src='/ball/paddle2.png'
          width={12}
          height={110}
          alt='Paddle 1'
        ></Image>
      )}
      <Drawer
        PaperProps={{
          variant: 'outlined',
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            top: '10vh',
            height: '80vh',
            padding: '7px',
            border: 'solid 5px #7209B775',
            borderRadius: '0 15px 15px 0',
            // background: '#3A0CA375',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
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
