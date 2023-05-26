'use client';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function Bar() {
  return (
    <>
      <Box mb={4}>
        <AppBar position='static'>
          <Toolbar>
            <Box mr={2}>
              <ChatIcon fontSize={'large'} />
            </Box>
            <Typography variant='h6'>My Retarded Chat box</Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
