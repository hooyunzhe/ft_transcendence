'use client';
import { Box } from '@mui/material';
import LeaderboardDisplay from './LeaderboardDisplay';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useProfileActions, useStatistics } from '@/lib/stores/useProfileStore';
import { useEffect } from 'react';

export default function LeaderboardList() {
  const currentUser = useCurrentUser();
  const statistics = useStatistics();
  const { getProfileData } = useProfileActions();

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Box
      sx={{ overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='center'
      padding='1vh'
      gap='1vh'
    >
      {statistics.map((statistic, index) => (
        <LeaderboardDisplay
          key={index}
          rank={index}
          statistic={statistic}
          isCurrentUser={statistic.user.id === currentUser.id}
        />
      ))}
    </Box>
  );
}
