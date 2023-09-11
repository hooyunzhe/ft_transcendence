'use client';
import { Box, Typography } from '@mui/material';

interface GameDisconnectedProps {
  isCurrentUser: boolean;
}

export default function GameDisconnected({ isCurrentUser }: GameDisconnectedProps) {
  return (
    <Box sx={{ ml: 2 }}>
      <Typography variant='h6' color='#DDDDDD'>
        {isCurrentUser ? 'You have connected from another window' : 'Opponent disconnected'}, returning to main menu...
      </Typography>
    </Box>
  );
}
