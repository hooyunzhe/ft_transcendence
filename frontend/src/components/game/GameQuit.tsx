'use client';
import { Box, Button, Typography } from '@mui/material';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';

export default function GameQuit() {
  const { setCurrentView } = useUtilActions();

  return (
    <Box sx={{ ml: 2 }}>
      <Typography variant='h6'>Do you want to Quit the game?</Typography>
      <Button variant='contained' onClick={() => setCurrentView(View.GAME)}>
        YES
      </Button>
    </Box>
  );
}
