'use client';
import { AppBar, Box, Grid, Paper, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function ChannelHeader() {
  return (
    <Paper elevation={2} sx={{ color: 'blue' }}>
      <Toolbar>
        <Box mr={2}>
          <ChatIcon fontSize={'large'} />
        </Box>
        <Typography variant='h6'>My Retarded Channel Members</Typography>
      </Toolbar>
    </Paper>
  );
}
