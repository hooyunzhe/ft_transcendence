'use client';
import { Box, Button, Typography } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';

export default function GameQuit() {
  const gameSocket = useGameSocket();
  const { setCurrentView } = useUtilActions();

  const leaveGame = () => {
    if (gameSocket) {
      gameSocket.emit('disconnect');
      setCurrentView(View.GAME);
    }
  };
  return (
    <Box sx={{ ml: 2 }}>
      <Typography variant='h6'>Do you want to Quit the game?</Typography>
      <Button variant='contained' onClick={leaveGame}>
        YES
      </Button>
    </Box>
  );
}
