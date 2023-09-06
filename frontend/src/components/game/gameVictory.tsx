'use client';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

interface GameVictoryProps {
  victor: { id: number; nickname: string };
  loser: { id: number; nickname: string };
}
export default function GameVictory({ victor, loser }: GameVictoryProps) {
  const currentUser = useCurrentUser();

  function getText() {
    if (
      currentUser.id === victor.id ||
      (currentUser.id != victor.id && currentUser.id != loser.id)
    )
      return victor.nickname + '\n' + 'Win!';
    else return loser.nickname + '\n' + 'Lose!';
  }
  return (
    <Box sx={{ ml: 2 }}>
      <img
        style={{
          position: 'absolute',
          zIndex: -1,
          objectFit: 'cover',
        }}
        src='/assets/victory.gif'
        alt='Looping GIF'
      />
      <Typography variant='h6'>{getText()}</Typography>
    </Box>
  );
}
