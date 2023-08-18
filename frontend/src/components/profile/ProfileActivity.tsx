'use client';
import { Box } from '@mui/material';
import ProfileMatchHistory from './ProfileMatchHistory';
import ProfileAchievementShowcase from './ProfileAchievementShowcase';

export default function ProfileActivity() {
  return (
    <Box display='flex' justifyContent='space-between'>
      <ProfileMatchHistory />
      <ProfileAchievementShowcase />
    </Box>
  );
}
