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
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: '20px 30px',
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {achievements.map((achievement: Achievement, index: number) => (
        <AchievementDisplay
          key={index}
          achievement={achievement}
          isEarned={achievementsEarned[achievement.id]}
        />
      ))}
    </Box>
  );
}
