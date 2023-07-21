'use client';
import { Box, Paper, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

interface ListHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function ListHeader({ title, children }: ListHeaderProps) {
  return (
    <Paper elevation={2} sx={{ color: 'blue' }}>
      <Toolbar>
        <Box mr={2}>
          <ChatIcon fontSize={'large'} />
        </Box>
        <Typography variant='h6'>{title}</Typography>
        {children}
      </Toolbar>
    </Paper>
  );
}
