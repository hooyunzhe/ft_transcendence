'use client';
import { Box } from '@mui/material';
import ProfileStatCard from './ProfileStatCard';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileStatsProps {
  statistic: Statistic;
}

export default function ProfileStats({ statistic }: ProfileStatsProps) {
  function getFavoritePath(): string {
    const pathCounts = [
      statistic.strength_count ?? 0,
      statistic.speed_count ?? 0,
      statistic.tech_count ?? 0,
    ];

    if (pathCounts.every((count) => count === 0)) {
      return 'N/A';
    }

    switch (pathCounts.indexOf(Math.max(...pathCounts))) {
      case 0:
        return 'Kratos';
      case 1:
        return 'Chronos';
      case 2:
        return 'Qosmos';
    }
    return 'N/A';
  }

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
      <ProfileStatCard description='Favorite Path' stats={getFavoritePath()} />
      <ProfileStatCard description='Punching Bag' stats='N/A' />
      <ProfileStatCard description='Archenemy' stats='EL' />
    </Box>
  );
}
