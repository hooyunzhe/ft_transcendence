'use client';
import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   console.log(pathname);
  //   router.push('/');
  // }, [pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <TextField
        id='username'
        label='Username'
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            console.log('HELLO FROM ENTER');
            router.push('/42_oauth');
          }
        }}
      ></TextField>
    </Box>
  );
}
