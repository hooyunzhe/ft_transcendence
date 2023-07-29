'use client';
import { Box, Typography } from '@mui/material';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';

export default function ChatHeader() {
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      display='flex'
      minHeight='5.5vh'
      justifyContent='center'
      alignItems='center'
      bgcolor='#363636'
    >
      <Typography variant='h4' color='white'>
        {selectedChannel?.name ?? 'No Channel Selected'}
      </Typography>
    </Box>
  );
}
