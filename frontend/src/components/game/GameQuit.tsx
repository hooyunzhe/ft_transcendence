'use client';
import { Box, Button, Typography } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { GameMode, MatchState } from '@/types/GameTypes';

export default function GameQuit() {
  const gameSocket = useGameSocket();
  const { setMatchState, setSelectedGameMode } = useGameActions();
  const { resetBackdrop } = useBackdropActions();

  const leaveGame = () => {
    if (gameSocket) {
      gameSocket.emit('disconnect');
      setMatchState(MatchState.END);
      setSelectedGameMode(GameMode.CYBERPONG);
      resetBackdrop();
    }
  };
  return (
    <Box sx={{ ml: 2 }} onClick={(event) => event.stopPropagation()}>
      <Typography variant='h6' color='#DDDDDD'>
        Do you want to Quit the game?
      </Typography>
      <Button variant='contained' onClick={leaveGame}>
        YES
      </Button>
    </Box>
  );
}
