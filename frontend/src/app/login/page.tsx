'use client';
import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import signUp from '@/lib/signUp';

export default function Login() {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push('/');
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {session && !session?.user && (
        <TextField
          id='username'
          label='Username'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              signUp(username, session.refresh_token);
              router.push('/');
            }
          }}
        ></TextField>
      )}
      {!session && (
        <Button variant='contained' onClick={() => signIn('42-school')}>
          Continue with 42
        </Button>
      )}
    </Box>
  );
}
