import { Achievement } from '@/types/AchievementTypes';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import AchievementIconAvatar from './AchievementIconAvatar';

interface AchievementDisplayProps {
  achievement: Achievement;
  dateAchieved: string;
}

export default function AchievementDisplay({
  achievement,
  dateAchieved,
}: AchievementDisplayProps) {
  return (
    <Box width='50%' display='flex'>
      <Paper
        sx={{
          display: 'flex',
          margin: '5px',
          padding: '1vh',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          sx={{ opacity: dateAchieved ? '1' : '0.3' }}
        >
          <Avatar
            variant='square'
            sx={{ width: '50px', height: '50px', bgcolor: 'black' }}
          >
            <AchievementIconAvatar achievementID={achievement.id} />
          </Avatar>
          <Box
            width='100%'
            display='flex'
            justifyContent='flex-start'
            alignItems='center'
            margin='0 0 0 10px'
          >
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {achievement.name}
              </Typography>
              <Typography>{achievement.description}</Typography>
            </Box>
            {dateAchieved && (
              <Typography marginLeft='auto'>
                {'Earned ' + dateAchieved}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
