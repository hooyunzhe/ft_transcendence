'use client';
import { Box } from '@mui/material';
import SocialDrawer from './SocialDrawer';
import ContentBox from './ContentBox';
import ChannelMemberDrawer from './ChannelMemberDrawer';
import AchievementBox from '../achievement/AchievementBox';

export default function MainArea() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '70vh',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <SocialDrawer />
      <ContentBox />
      <ChannelMemberDrawer />
    </Box>
  );
}
