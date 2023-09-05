'use client';
import { Box } from '@mui/material';
import ToolbarHeader from '../utils/ToolbarHeader';
import LeaderboardList from './LeaderboardList';
import { ToolbarHeaderType } from '@/types/UtilTypes';

export default function LeaderboardBox() {
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ToolbarHeader title='Leaderboard' type={ToolbarHeaderType.LEADERBOARD} />
      <LeaderboardList />
    </Box>
  );
}
