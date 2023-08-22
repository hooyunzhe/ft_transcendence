'use client';
import { Box } from '@mui/material';
import ListHeader from '../utils/ListHeader';
import { ListHeaderIcon } from '@/types/UtilTypes';
import LeaderboardList from './LeaderboardList';

export default function LeaderboardBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title='Leaderboard' icon={ListHeaderIcon.LEADERBOARD} />
      <LeaderboardList />
    </Box>
  );
}
