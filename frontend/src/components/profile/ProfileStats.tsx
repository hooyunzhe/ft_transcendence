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
  const { getFavoriteClass } = useProfileActions();
  const { getNotableOpponents, getClassName } = useGameActions();
  const { punchingBag, archenemy } = getNotableOpponents(statistic.user.id);

  return (
    <Box height='100%' display='flex' justifyContent='space-between'>
      <ProfileStatCard
        description='Wins / Losses'
        stats={`${statistic.wins} / ${statistic.losses}`}
      />
      <ProfileStatCard
        alignEnd
        description='Highest Winstreak'
        stats={`${statistic.highest_winstreak}`}
      />
      <ProfileStatCard
        description='Favorite Class'
        stats={getClassName(getFavoriteClass(statistic))}
      />
      <ProfileStatCard
        alignEnd
        description='Punching Bag'
        stats={punchingBag}
      />
      <ProfileStatCard description='Archenemy' stats={archenemy} />
    </Box>
  );
}
