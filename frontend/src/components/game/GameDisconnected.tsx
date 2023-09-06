'use client';
import { Box, Typography } from '@mui/material';

export default function GameDisconnected() {
  return (
    <Box sx={{ ml: 2 }}>
      <Typography variant='h6'>
        Opponent disconnected, returning to main menu...
      </Typography>
    </Box>
  );
}
