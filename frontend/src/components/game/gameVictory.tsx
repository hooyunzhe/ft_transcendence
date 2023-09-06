'use client';
import { Box, Typography } from '@mui/material';
import { useCurrentUser } from '@/lib/stores/useUserStore';

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
    <Box
      width='80vw'
      height='80vh'
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      sx={{
        backgroundImage: '/assets/victory.gif',
      }}
    >
      {/* <img
        style={{
          position: 'absolute',
          zIndex: -1,
          objectFit: 'cover',
        }}
        src=''
        alt='Looping GIF'
      /> */}
      <Typography variant='h6'>{getText()}</Typography>
    </Box>
  );
}
