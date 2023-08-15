'use client';
import { Box } from '@mui/material';
import ProfileMatchHistory from './ProfileMatchHistory';

export default function ProfileActivity() {
  return (
    <Box
      height='40vh'
      marginTop='auto'
      display='flex'
      justifyContent='space-between'
    >
      <ProfileMatchHistory />
      <ProfileMatchHistory />
    </Box>
  );
}
