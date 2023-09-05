'use client';
import { Box } from '@mui/material';
import ToolbarHeader from '../utils/ToolbarHeader';
import AchievementGrid from './AchievementGrid';
import { ToolbarHeaderType } from '@/types/UtilTypes';

export default function AchievementBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ToolbarHeader
        title={'Achievements'}
        type={ToolbarHeaderType.ACHIEVEMENTS}
      />
      <AchievementGrid />
    </Box>
  );
}
