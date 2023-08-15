'use client';
import { Box, Stack, Typography } from '@mui/material';

export default function ProfileMatchHistory() {
  return (
    <Stack
      spacing={1}
      padding='5px'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {[
        { name: 'Match One', score: '11 / 5' },
        { name: 'Match Two', score: '11 / 2' },
        { name: 'Match Three', score: '4 / 11' },
        { name: 'Match Four', score: '11 / 7' },
        { name: 'Match Five', score: '11 / 1' },
      ].map((match, index) => (
        <Box
          key={index}
          width='28vw'
          height='8vh'
          display='flex'
          border='solid 2px #7209B775'
          borderRadius='10px'
          bgcolor='#4CC9F075'
        >
          <Typography variant='h5'>{match.name}</Typography>
          <Typography variant='h6'>{match.score}</Typography>
        </Box>
      ))}
    </Stack>
  );
}
