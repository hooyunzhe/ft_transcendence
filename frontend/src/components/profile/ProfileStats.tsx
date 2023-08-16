'use client';
import { Box } from '@mui/material';
import ProfileStatCard from './ProfileStatCard';
import { useSelectedStatistic } from '@/lib/stores/useProfileStore';

export default function ProfileStats() {
  const selectedStatistic = useSelectedStatistic();

  function getFavoritePath(): string {
    const pathCounts = [
      selectedStatistic?.strength_count ?? 0,
      selectedStatistic?.speed_count ?? 0,
      selectedStatistic?.tech_count ?? 0,
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
        stats={`${selectedStatistic?.wins} / ${selectedStatistic?.losses}`}
      />
      <ProfileStatCard
        description='Highest Winstreak'
        stats={`${selectedStatistic?.highest_winstreak}`}
      />
      <ProfileStatCard description='Favorite Path' stats={getFavoritePath()} />
      <ProfileStatCard description='Punching Bag' stats='N/A' />
      <ProfileStatCard description='Archenemy' stats='EL' />
    </Box>
  );
}
