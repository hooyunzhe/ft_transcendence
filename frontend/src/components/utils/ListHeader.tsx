'use client';
import { Box, Paper, Toolbar, Typography } from '@mui/material';
import { EmojiEvents, Groups, LeaderboardRounded } from '@mui/icons-material';
import { ListHeaderIcon } from '@/types/UtilTypes';

interface ListHeaderProps {
  title: string;
  icon: ListHeaderIcon;
  children?: React.ReactNode;
}

export default function ListHeader({ title, icon, children }: ListHeaderProps) {
  return (
    <Paper elevation={2} sx={{ color: 'white', background: '#3A0CA375' }}>
      <Toolbar>
        <Box mr={2}>
          {icon === ListHeaderIcon.SOCIAL && <Groups fontSize='large' />}
          {icon === ListHeaderIcon.ACHIEVEMENTS && (
            <EmojiEvents fontSize='large' />
          )}
          {icon === ListHeaderIcon.LEADERBOARD && (
            <LeaderboardRounded fontSize='large' />
          )}
        </Box>
        <Typography variant='h6'>{title}</Typography>
        {children}
      </Toolbar>
    </Paper>
  );
}
