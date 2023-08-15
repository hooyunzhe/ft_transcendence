'use client';
import {
  AssistantDirection,
  FastForward,
  FastRewind,
  KeyboardDoubleArrowDown,
  Speed,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export default function ProfileMatchHistory() {
  return (
    <Box
      height='36vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      padding='5px'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {[
        {
          date: new Date().toLocaleDateString(),
          path: 'Chronos',
          name: 'Super EL',
          score: '11 - 5',
        },
        {
          date: new Date().toLocaleDateString(),
          path: 'Qosmos',
          name: 'Eu Lee',
          score: '11 - 2',
        },
        {
          date: new Date().toLocaleDateString(),
          path: 'Kratos',
          name: 'EL',
          score: '4 - 11',
        },
        {
          date: new Date().toLocaleDateString(),
          path: 'Chronos',
          name: 'Derpina',
          score: '11 - 7',
        },
        {
          date: new Date().toLocaleDateString(),
          path: 'Chronos',
          name: 'Derpiner',
          score: '11 - 1',
        },
      ].map((match, index) => (
        <Box
          key={index}
          width='28vw'
          height='6vh'
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          border='solid 2px #7209B775'
          borderRadius='10px'
          bgcolor='#4CC9F075'
        >
          <Box width='10vw'>
            <Typography variant='h5'>{match.name}</Typography>
            <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
              {match.date}
            </Typography>
          </Box>
          <Box
            width='8vw'
            display='flex'
            flexDirection='column'
            justifyContent='space-around'
            alignItems='flex-start'
          >
            <Typography variant='h6'>{match.path}</Typography>
            <Box>
              <Speed /> {/* Increase paddle speed */}
              <KeyboardDoubleArrowDown /> {/* Reduce incoming ball speed */}
              <AssistantDirection /> {/* Paddle assist */}
              <FastForward /> {/* Speed up time */}
              <FastRewind /> {/* Slow down time */}
            </Box>
          </Box>
          <Typography width='4vw' variant='h6' align='right'>
            {match.score}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
