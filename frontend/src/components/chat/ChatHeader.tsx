'use client';
import { Box, Typography } from '@mui/material';

interface ChatHeaderProps {
  channelName: string;
}

export default function ChatHeader({ channelName }: ChatHeaderProps) {
  return (
    <Box
      display='flex'
      height='5.5vh'
      justifyContent='center'
      alignItems='center'
      bgcolor='#363636'
    >
      <Typography variant='h4' color='white'>
        {channelName}
      </Typography>
    </Box>
  );
}
