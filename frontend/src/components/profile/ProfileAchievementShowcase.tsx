'use client';
import { Box, Typography } from '@mui/material';
import ProfileAchievementDisplay from './ProfileAchievementDisplay';
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
      gap='1vh'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {recentAchievements[statistic.user.id] ? (
        recentAchievements[statistic.user.id].map((userAchievement, index) => (
          <ProfileAchievementDisplay
            key={index}
            achievement={userAchievement.achievement}
            dateEarned={userAchievement.date_of_creation}
          />
        ))
      ) : (
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
