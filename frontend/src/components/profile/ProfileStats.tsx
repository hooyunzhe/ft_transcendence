'use client';
import { Box } from '@mui/material';
import ProfileStatCard from './ProfileStatCard';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileStatsProps {
  statistic: Statistic;
}

export default function ProfileStats({ statistic }: ProfileStatsProps) {
  const { getFavoritePath } = useProfileActions();
  const { getPathName } = useGameActions();

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <ProfileStatCard
        description='Wins / Losses'
        stats={`${statistic.wins} / ${statistic.losses}`}
      />
      <ProfileStatCard
        description='Highest Winstreak'
        stats={`${statistic.highest_winstreak}`}
      />
      <ProfileStatCard
        description='Favorite Path'
        stats={getPathName(getFavoritePath(statistic))}
      />
      <ProfileStatCard description='Punching Bag' stats='N/A' />
      <ProfileStatCard description='Archenemy' stats='EL' />
    </Box>
  );
}
