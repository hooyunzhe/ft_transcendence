'use client';
import { SportsTennis } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';

interface ProfileAchievementDisplayProps {
  name: string;
  description: string;
  date_of_creation: string;
}

export default function ProfileAchievementDisplay({
  name,
  description,
  date_of_creation,
}: ProfileAchievementDisplayProps) {
  return (
    <Box
      width='13.5vw'
      height='17vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
      alignItems='center'
      // gap='1vh'
      border='solid 2px black'
      borderRadius='10px'
      bgcolor='#7209B790'
    >
      <Avatar
        sx={{
          width: '40px',
          height: '40px',
          alignSelf: 'flex-start',
          marginLeft: '1vw',
          bgcolor: 'green',
          border: 'solid 1px black',
        }}
      >
        <SportsTennis />
      </Avatar>
      <Box width='90%' height='50%'>
        <Typography variant='h6'>{name}</Typography>
        <Typography variant='body2'>{description}</Typography>
      </Box>
    </Box>
  );
}
