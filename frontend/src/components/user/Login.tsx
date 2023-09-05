'use client';
import '../../styles/cyberfont.css';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Box, Button, Slide, Typography } from '@mui/material';

export default function Login() {
  return (
    <Box
      width='60vw'
      height='70vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
    >
      <Slide direction='down' in timeout={2500}>
        <Typography
          sx={{
            textShadow: '4px 4px 6px black',
          }}
          fontFamily='cyberfont'
          letterSpacing='1rem'
          color='#DDDDDD'
          variant='h1'
          align='center'
        >
          Cyberpong
        </Typography>
      </Slide>
      <Slide direction='up' in timeout={2500}>
        <Button
          sx={{
            alignSelf: 'center',
            width: '30vw',
            border: 'solid 3px #363636',
            borderRadius: '15px',
            bgcolor: '#4CC9F080',
            ':hover': {
              bgcolor: '#4CC9F060',
            },
          }}
          onClick={() => signIn('42-school')}
        >
          <Image
            width='54'
            height='54'
            alt='42 Logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png'
          />
        </Button>
      </Slide>
    </Box>
  );
}
