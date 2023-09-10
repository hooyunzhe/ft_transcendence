'use client';
import { Box, Typography } from '@mui/material';
import ProfileAchievementRow from './ProfileAchievementRow';
import { useRecentAchievements } from '@/lib/stores/useAchievementStore';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileAchievementShowcaseProps {
  statistic: Statistic;
}

export default function ProfileAchievementShowcase({
  statistic,
}: ProfileAchievementShowcaseProps) {
  const recentAchievements = useRecentAchievements();

  return (
    <Box
      width='28.5vw'
      height='36vh'
      display='flex'
      flexWrap='wrap'
      justifyContent='flex-start'
      alignContent='flex-start'
      alignItems='center'
      padding='5px'
      rowGap='0.9vh'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {recentAchievements[statistic.user.id] && (
        <ProfileAchievementRow
          achievements={recentAchievements[statistic.user.id].slice(0, 2)}
        />
      )}
      {recentAchievements[statistic.user.id] && (
        <ProfileAchievementRow
          achievements={recentAchievements[statistic.user.id].slice(2, 4)}
        />
      )}
      {!recentAchievements[statistic.user.id] && (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          marginTop='16vh'
          marginLeft='7vw'
        >
          No achievements earned
        </Typography>
      )}
    </Box>
  );
}
