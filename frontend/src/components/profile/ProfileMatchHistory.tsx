'use client';
import { Box, Typography } from '@mui/material';
import { useRecentMatches } from '@/lib/stores/useGameStore';
import ProfileMatchDisplay from './ProfileMatchDisplay';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileMatchHistoryProps {
  statistic: Statistic;
}

export default function ProfileMatchHistory({
  statistic,
}: ProfileMatchHistoryProps) {
  const recentMatches = useRecentMatches();

  return (
    <Box
      width='28.5vw'
      height='36vh'
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='center'
      padding='5px'
      gap='1vh'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {statistic.wins + statistic.losses > 0 ? (
        recentMatches[statistic.user.id].map((match, index) => (
          <ProfileMatchDisplay
            key={index}
            match={match}
            currentPlayer={statistic.user}
          />
        ))
      ) : (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          marginTop='16vh'
        >
          No matches played
        </Typography>
      )}
    </Box>
  );
}
