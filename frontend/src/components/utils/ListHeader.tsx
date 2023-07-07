'use client';
import { Box, Paper, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

interface ListHeaderProps {
  title: string;
}

export default function ListHeader({ title }: ListHeaderProps) {
  return (
    <Paper elevation={2} sx={{ color: 'blue' }}>
      <Toolbar>
        <Box mr={2}>
          <ChatIcon fontSize={'large'} />
        </Box>
        <Typography variant='h6'>{title}</Typography>
      </Toolbar>
    </Paper>
  );
}
