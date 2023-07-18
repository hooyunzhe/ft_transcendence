'use client';
import signUp from '@/lib/signUp';
import { useUserActions } from '@/lib/stores/useUserStore';
import { TextField } from '@mui/material';
import { useState } from 'react';

interface FirstTimeSetupProps {
  refresh_token: string;
}

export default function FirstTimeSetup({ refresh_token }: FirstTimeSetupProps) {
  const { setCurrentUser } = useUserActions();
  const [username, setUsername] = useState('');

  return (
    <TextField
      id='username'
      label='Username'
      onChange={(e) => {
        setUsername(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          signUp(username, refresh_token).then((newUser) =>
            setCurrentUser(newUser),
          );
        }
      }}
    ></TextField>
  );
}
