'use client';
import { Box, Paper, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function ChannelHeader() {
  return (
    <Paper elevation={2}>
      <Toolbar>
        <Box mr={2}>
          <ChatIcon fontSize={'large'} />
        </Box>
        <Typography variant='h6'>Channels</Typography>
      </Toolbar>
    </Paper>
  );
}
