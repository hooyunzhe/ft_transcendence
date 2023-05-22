'use client';

import { Box, Button, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FT_OAuth() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <h1>42 OAuth</h1>
      <Button onClick={() => router.push('/api/auth')}>Authorize</Button>
    </Box>
  );
}
