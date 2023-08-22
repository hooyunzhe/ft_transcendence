// import { useUserAchievementChecks } from '@/lib/stores/useAchievementStore';
import { Achievement } from '@/types/AchievementTypes';
import { Avatar, Box, Paper, Typography } from '@mui/material';

interface AchievementDisplayProps {
  achievement: Achievement;
  isEarned: boolean;
}

export default function AchievementDisplay({
  achievement,
  isEarned,
}: AchievementDisplayProps) {
  console.log(achievement);
  return (
    <Box
      sx={{
        width: '50%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          margin: '10px',
          padding: '20px',
          width: '90%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            opacity: isEarned ? '1' : '0.3',
          }}
        >
          <Avatar>W</Avatar>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              margin: '0 0 0 10px',
            }}
          >
            <Typography>{achievement.name}</Typography>
            <Typography fontSize={15}>{achievement.description}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
