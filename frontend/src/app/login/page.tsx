'use client';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import WithSessionProvider from '@/components/WithSessionProvider';

export default async function Login() {
  // const [username, setUsername] = useState('');

  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <h1>{JSON.stringify(session)}</h1>
      <Button variant='contained' onClick={() => signIn('42-school')}>
        Continue with 42
      </Button>
      {/* <TextField
			id='username'
			label='Username'
			onChange={(e) => {
				setUsername(e.target.value);
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					signIn('42-school');
				}
			}}
		></TextField> */}
    </Box>
  );
}
