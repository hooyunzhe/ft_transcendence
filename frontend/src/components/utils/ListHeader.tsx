'use client';
import { Box, Toolbar, Typography } from '@mui/material';
import {
  Diversity3,
  EmojiEvents,
  Groups,
  LeaderboardRounded,
  Settings,
} from '@mui/icons-material';
import { ListHeaderType } from '@/types/UtilTypes';

interface ListHeaderProps {
  title: string;
  type: ListHeaderType;
  children?: React.ReactNode;
}

export default function ListHeader({ title, type, children }: ListHeaderProps) {
  return (
    <Toolbar
      sx={{
        color: '#DDDDDD',
        background:
          type === ListHeaderType.SOCIAL
            ? '#e8514980'
            : type === ListHeaderType.CHANNEL_MEMBER
            ? '#363bd680'
            : 'linear-gradient(90deg, #e8514980, #363bd680)',
      }}
    >
      <Box mr={2}>
        {type === ListHeaderType.SOCIAL && <Diversity3 fontSize='large' />}
        {type === ListHeaderType.CHANNEL_MEMBER && <Groups fontSize='large' />}
        {type === ListHeaderType.LEADERBOARD && (
          <LeaderboardRounded fontSize='large' />
        )}
        {type === ListHeaderType.ACHIEVEMENTS && (
          <EmojiEvents fontSize='large' />
        )}
        {type === ListHeaderType.SETTINGS && <Settings fontSize='large' />}
      </Box>
      <Typography variant='h6'>{title}</Typography>
      {children}
    </Toolbar>
  );
}
