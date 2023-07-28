'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import { ChannelMemberList } from '../channel-member/ChannelMemberList';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';

export default function ChannelMemberDrawer() {
  const [open, setOpen] = useState(false);
  const selectedChannel = useSelectedChannel();

  return (
    <Box>
      <div>{selectedChannel?.id}</div>
      {selectedChannel && (
        <Image
          src='/ball/paddle1.png'
          width={12}
          height={110}
          alt='Paddle 2'
        ></Image>
      )}
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
        anchor='right'
        open={selectedChannel ? true : false}
      >
        <ChannelMemberList />
      </Drawer>
    </Box>
  );
}
