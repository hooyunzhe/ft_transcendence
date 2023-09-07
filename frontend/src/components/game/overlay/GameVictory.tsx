'use client';
import Image from 'next/image';
import { Box, Typography, Grow } from '@mui/material';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useEffect, useState } from 'react';

interface GameVictoryProps {
  victor: { id: number; nickname: string };
  loser: { id: number; nickname: string };
}
export default function GameVictory({ victor, loser }: GameVictoryProps) {
  const currentUser = useCurrentUser();
  const [growIn, setGrowIn] = useState(false);

  function getText() {
    if (currentUser.id === victor.id) {
      return 'You Win!';
    } else if (currentUser.id === loser.id) {
      return 'You Lose!';
    } else {
      return victor.nickname + '\n' + ' Wins!';
    }
  }

  useEffect(() => {
    setGrowIn(true);
    setTimeout(() => setGrowIn(false), 6000);
  }, []);

  return (
    // <Grow in timeout={3000}>
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      justifyContent='space-around'
      alignItems='center'
    >
      <video
        width='100%'
        height='100%'
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          zIndex: -2,
          objectFit: 'cover',
          filter: currentUser.id === loser.id ? 'grayscale(70%)' : 'none',
        }}
      >
        <source src='/assets/background1.mp4' type='video/mp4' />
      </video>
      <Image
        width={600}
        height={338}
        style={{
          position: 'absolute',
          zIndex: -1,
          objectFit: 'cover',
          opacity: 0.5,
        }}
        src='/assets/victory.gif'
        alt='Looping GIF'
      />
      <Typography
        fontFamily='cyberthrone'
        letterSpacing='1rem'
        variant='h1'
        color='#DDDDDD'
      >
        {getText()}
      </Typography>
    </Box>
    // </Grow>
  );
}
