'use client';
import { Box } from '@mui/material';
import ProfileAchievementDisplay from './ProfileAchievementDisplay';
import { UserAchievement } from '@/types/UserAchievementTypes';

interface ProfileAchievementRowProps {
  achievements: UserAchievement[];
}

export default function ProfileAchievementRow({
  achievements,
}: ProfileAchievementRowProps) {
  return (
    <Box
      display='flex'
      justifyContent='flex-start'
      alignItems='center'
      gap='0.5vw'
    >
      {achievements.map((userAchievement, index) => (
        <ProfileAchievementDisplay
          key={index}
          achievement={userAchievement.achievement}
          dateEarned={userAchievement.date_of_creation}
        />
      ))}
    </Box>
  );
}
