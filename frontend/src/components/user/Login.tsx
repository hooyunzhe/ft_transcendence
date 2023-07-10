'use client';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <Button variant='contained' onClick={() => signIn('42-school')}>
      Continue with 42
    </Button>
  );
}
