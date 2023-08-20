'use client';
import { Avatar, Box, Typography } from '@mui/material';
import {
  ArrowCircleDown,
  ArrowCircleUp,
  EmojiEvents,
} from '@mui/icons-material';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { Statistic } from '@/types/StatisticTypes';

interface LeaderboardDisplayProps {
  rank: number;
  statistic: Statistic;
}

export default function LeaderboardDisplay({
  rank,
  statistic,
}: LeaderboardDisplayProps) {
  const { getFavoritePath } = useProfileActions();
  const { getPathName } = useGameActions();

  const statsToDisplay = [
    { minWidth: '2.5vw', name: 'Wins', stat: `${statistic.wins}` },
    {
      minWidth: '4vw',
      name: 'Win Rate',
      stat: `${
        Math.round(
          (statistic.wins / (statistic.wins + statistic.losses) || 0) * 1000,
        ) / 10
      }%`,
    },
    {
      minWidth: '7vw',
      name: 'Highest Winstreak',
      stat: `${statistic.highest_winstreak}`,
    },
    {
      minWidth: '5.5vw',
      name: 'Favorite Path',
      stat: `${getPathName(getFavoritePath(statistic))}`,
    },
  ];

  return (
    <Box
      width='100%'
      height='8vh'
      boxSizing='border-box'
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      padding='1vw'
      border='solid 2px #a291d2'
      borderRadius='10px'
      bgcolor='#a291d290'
    >
      <Box
        display='flex'
        justifyContent='flex-start'
        alignItems='center'
        gap='1vw'
      >
        <Box
          width='3vw'
          display='flex'
          justifyContent='space-around'
          alignItems='center'
        >
          {rank === 0 ? (
            <EmojiEvents />
          ) : (
            <Typography variant='h6'>{`#${rank + 1}`}</Typography>
          )}
          {rank % 2 == 0 ? (
            <ArrowCircleUp sx={{ color: '#00C5AD' }} />
          ) : (
            <ArrowCircleDown sx={{ color: '#EB370095' }} />
          )}
        </Box>
        <Avatar
          src={statistic.user.avatar_url}
          sx={{ border: 'solid 1px black' }}
        />
        <Typography variant='h6'>{statistic.user.username}</Typography>
      </Box>
      <Box
        width='30vw'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        gap='1vw'
      >
        {statsToDisplay.map((statToDisplay, index) => (
          <Box key={index} minWidth={statToDisplay.minWidth}>
            <Typography variant='body2'>{statToDisplay.name}</Typography>
            <Typography variant='h5'>{statToDisplay.stat}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
