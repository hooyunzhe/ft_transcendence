'use client';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function GameSearch() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeElapsed((timeElapsed) => timeElapsed + 1),
      1000,
    );

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      width='15vw'
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      onClick={(event) => event.stopPropagation()}
    >
      <CircularProgress />
      <Box>
        <Typography color='white' variant='h6'>
          Searching Match{'.'.repeat(timeElapsed % 4)}
        </Typography>
        <Typography color='white'>
          Time elapsed: {timeElapsed} seconds
        </Typography>
      </Box>
    </Box>
  );
}
