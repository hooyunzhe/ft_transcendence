'use client';
import { Box } from '@mui/material';
import ListHeader from '../utils/ListHeader';
import { ListHeaderType } from '@/types/UtilTypes';
import LeaderboardList from './LeaderboardList';

export default function LeaderboardBox() {
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title='Leaderboard' type={ListHeaderType.LEADERBOARD} />
      <LeaderboardList />
    </Box>
  );
}
