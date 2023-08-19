'use client';
import { Box } from '@mui/material';
import ProfileMatchHistory from './ProfileMatchHistory';
import ProfileAchievementShowcase from './ProfileAchievementShowcase';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileActivityProps {
  statistic: Statistic;
}

export default function ProfileActivity({ statistic }: ProfileActivityProps) {
  return (
    <Box display='flex' justifyContent='space-between'>
      <ProfileMatchHistory statistic={statistic} />
      <ProfileAchievementShowcase statistic={statistic} />
    </Box>
  );
}
