'use client';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [submit, setSubmit] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      {submit ? (
        <Button>{username}</Button>
      ) : (
        <TextField
          id='username'
          label='Username'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => {
            setSubmit(e.key === 'Enter');
          }}
        ></TextField>
      )}
    </Box>
  );
}
