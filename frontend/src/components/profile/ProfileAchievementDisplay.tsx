'use client';
import { Achievement } from '@/types/AchievementTypes';
import { Avatar, Box, Typography } from '@mui/material';
import AchievementIcon from '../achievement/AchievementIcon';

interface ProfileAchievementDisplayProps {
  achievement: Achievement;
  dateEarned: string;
}

export default function ProfileAchievementDisplay({
  achievement,
  dateEarned,
}: ProfileAchievementDisplayProps) {
  return (
    <Box
      width='13.5vw'
      height='17vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
      alignItems='center'
      borderRadius='10px'
    >
      <Avatar
        sx={{
          width: '40px',
          height: '40px',
          alignSelf: 'flex-start',
          marginLeft: '0.5vw',
          bgcolor: 'steelblue',
          border: 'solid 1px black',
        }}
      >
        <AchievementIcon achievementID={achievement.id} />
      </Avatar>
      <Box
        width='90%'
        height='65%'
        display='flex'
        flexDirection='column'
        justifyContent='space-around'
      >
        <Typography variant='h6'>{achievement.name}</Typography>
        <Typography sx={{ marginBottom: 'auto' }} variant='body2'>
          {achievement.description}
        </Typography>
        <Typography variant='body2' align='right'>
          {new Date(dateEarned).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}
