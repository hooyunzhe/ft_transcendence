'use client';
import { Box } from '@mui/material';
import ProfileMatchHistory from './ProfileMatchHistory';

export default function ProfileActivity() {
  return (
    <Box display='flex' justifyContent='space-between'>
      <ProfileMatchHistory />
      {/* <ProfileMatchHistory /> */}
    </Box>
  );
}
