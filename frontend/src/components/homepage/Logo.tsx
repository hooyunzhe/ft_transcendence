'use client';
import { useEffect, useState } from 'react';
import { Drawer, Typography } from '@mui/material';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { useMatchState } from '@/lib/stores/useGameStore';
import { MatchState } from '@/types/GameTypes';

export default function Logo() {
  const [open, setOpen] = useState(false);
  const currentPreference = useCurrentPreference();
  const matchState = useMatchState();

  useEffect(() => {
    setOpen(true);

    return () => setOpen(false);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          marginTop: '1vh',
          marginLeft: '3.5vw',
          bgcolor: '#00000000',
        },
      }}
      variant='persistent'
      anchor='left'
      transitionDuration={500}
      open={
        matchState !== MatchState.INGAME &&
        (open || !currentPreference.animations_enabled)
      }
    >
      <Typography
        sx={{
          backgroundImage: 'linear-gradient(90deg, #363bd6, #e85149)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        }}
        fontFamily='cyberfont'
        letterSpacing='0.5rem'
        color='#DDDDDD'
        variant='h3'
        align='center'
      >
        Cyberpong
      </Typography>
    </Drawer>
  );
}
