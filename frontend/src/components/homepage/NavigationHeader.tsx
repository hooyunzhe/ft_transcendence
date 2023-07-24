'use client';
import { Box, Button, Drawer, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

export default function NavigationHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);

    return () => setOpen(false);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width: '35vw',
          height: '7.5vh',
          top: '92.5vh',
          border: 'solid 3px #7209B775',
          borderRadius: '0 15px 15px 0',
        },
      }}
      variant='persistent'
      anchor='left'
      transitionDuration={1000}
      open={open}
    >
      <Stack
        display='flex'
        direction='row'
        height='100%'
        justifyContent='center'
        alignItems='center'
        spacing={1}
      >
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          width='100%'
          height='100%'
        >
          <Button fullWidth variant='contained' sx={{ height: '100%' }}>
            Achievements
          </Button>
        </Box>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          width='100%'
          height='100%'
        >
          Leaderboard
        </Box>
      </Stack>
    </Drawer>
  );
}
