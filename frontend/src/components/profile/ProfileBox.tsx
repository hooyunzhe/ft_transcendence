'use client';
import { Box } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActivity from './ProfileActivity';

export default function ProfileBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
      gap='1vh'
    >
      <ProfileHeader />
      <ProfileStats />
      <ProfileActivity />
    </Box>
  );
}
