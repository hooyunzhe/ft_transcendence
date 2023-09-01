'use client';
import { Box } from '@mui/material';
import ListHeader from '../utils/ListHeader';
import AchievementGrid from './AchievementGrid';
import { ListHeaderType } from '@/types/UtilTypes';

export default function AchievementBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title={'Achievements'} type={ListHeaderType.ACHIEVEMENTS} />
      <AchievementGrid />
    </Box>
  );
}
