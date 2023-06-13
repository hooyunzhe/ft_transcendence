'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function ChannelHeader() {
  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 360}} mb={1}>
        <AppBar position='static'>
          <Toolbar>
            <Box mr={2}>
              <ChatIcon fontSize={'large'} />
            </Box>
            <Typography variant='h6'>My Retarded Channels</Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}