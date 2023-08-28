'use client';
import { ListHeaderIcon } from '@/types/UtilTypes';
import ListHeader from '../utils/ListHeader';
import AchievementGrid from './AchievementGrid';
import { Box } from '@mui/material';

export default function AchievementBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title={'Achievements'} icon={ListHeaderIcon.ACHIEVEMENTS} />
      <AchievementGrid />
    </Box>
  );
}
