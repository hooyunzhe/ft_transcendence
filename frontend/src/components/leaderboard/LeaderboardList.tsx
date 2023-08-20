'use client';
import { useStatistics } from '@/lib/stores/useProfileStore';
import { Box } from '@mui/material';
import LeaderboardDisplay from './LeaderboardDisplay';

export default function LeaderboardList() {
  const statistics = useStatistics();

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
      {statistics
        .sort(
          (a, b) =>
            b.wins - a.wins ||
            a.losses - b.losses ||
            b.highest_winstreak - a.highest_winstreak,
        )
        .map((statistic, index) => (
          <LeaderboardDisplay key={index} rank={index} statistic={statistic} />
        ))}
    </Box>
  );
}
