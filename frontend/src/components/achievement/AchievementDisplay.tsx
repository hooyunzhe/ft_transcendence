import { Avatar, Box, Typography } from '@mui/material';
import AchievementIcon from './AchievementIcon';
import { Achievement } from '@/types/AchievementTypes';

interface AchievementDisplayProps {
  achievement: Achievement;
  dateAchieved: string;
  displayHidden: boolean;
}

export default function AchievementDisplay({
  achievement,
  dateAchieved,
  displayHidden,
}: AchievementDisplayProps) {
  return (
    <Box width='50%' display='flex'>
      <Box
        display='flex'
        margin='5px'
        padding='1vh'
        width='100%'
        boxSizing='border-box'
        bgcolor='#A4B5C6'
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
            <AchievementIcon
              achievementID={
                displayHidden ? achievement.id + 1 : achievement.id
              }
            />
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
                {displayHidden ? 'Hidden' : achievement.name}
              </Typography>
              <Typography>
                {displayHidden ? 'Hidden' : achievement.description}
              </Typography>
            </Box>
            {dateAchieved && (
              <Typography marginLeft='auto'>
                {'Earned ' + dateAchieved}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
