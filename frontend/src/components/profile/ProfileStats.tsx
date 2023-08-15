'use client';
import { Box } from '@mui/material';
import ProfileStatCard from './ProfileStatCard';

export default function ProfileStats() {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <ProfileStatCard description='Wins / Losses' stats='4 / 1' />
      <ProfileStatCard description='Highest Winstreak' stats='2' />
      <ProfileStatCard description='Favorite Path' stats='Chronos' />
      <ProfileStatCard description='Punching Bag' stats='N/A' />
      <ProfileStatCard description='Archenemy' stats='EL' />
    </Box>
  );
}
