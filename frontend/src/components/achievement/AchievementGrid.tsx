'use client';
import { Box } from '@mui/material';
import {
  useAchievements,
  useAchievementsEarned,
} from '@/lib/stores/useAchievementStore';
import { Achievement } from '@/types/AchievementTypes';
import AchievementDisplay from './AchievementDisplay';

export default function AchievementGrid() {
  const achievements = useAchievements();
  const achievementsEarned = useAchievementsEarned();

  return (
    <Box
      height='100%'
      display='flex'
      flexWrap='wrap'
      padding='0.5vh 0.5vw'
      sx={{ overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      {achievements.map((achievement: Achievement, index: number) => (
        <AchievementDisplay
          key={index}
          achievement={achievement}
          dateAchieved={achievementsEarned[achievement.id]}
        />
      ))}
    </Box>
  );
}
