import { Box, Drawer } from '@mui/material';
import FriendList from '../friend/FriendList';
import { ChannelList } from '../channel/ChannelList';
import { useState } from 'react';
import Image from 'next/image';

export default function SocialDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        marginRight: 'auto',
      }}
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
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
            width: '20vw',
            top: '5vh',
            bottom: '5vh',
            height: '80vh',
            padding: '7px',
            border: 'solid 5px #7209B775',
            borderRadius: '0 15px 15px 0',
            background: '#3A0CA375',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <FriendList />
        {/* <ChannelList /> */}
      </Drawer>
    </Box>
  );
}
