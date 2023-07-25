'use client';
import { Box } from '@mui/material';
import SocialDrawer from './SocialDrawer';
import Image from 'next/image';
import ContentBox from './ContentBox';

export default function MainArea() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '70vh',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <SocialDrawer />
      <ContentBox />
      <Image
        src='/ball/paddle1.png'
        width={12}
        height={110}
        alt='Paddle 1'
      ></Image>
      {/* <ChannelMemberList></ChannelMemberList> */}
    </Box>
  );
}
