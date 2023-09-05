'use client';
import { Box, Toolbar, Typography } from '@mui/material';
import {
  Diversity3,
  EmojiEvents,
  Groups,
  LeaderboardRounded,
  People,
  Settings,
} from '@mui/icons-material';
import { ToolbarHeaderType } from '@/types/UtilTypes';

interface ToolbarHeaderProps {
  title: string;
  type: ToolbarHeaderType;
}

export default function ToolbarHeader({ title, type }: ToolbarHeaderProps) {
  return (
    <Toolbar
      sx={{
        color: '#DDDDDD',
        background:
          type === ToolbarHeaderType.SOCIAL
            ? '#e8514980'
            : type === ToolbarHeaderType.NONE ||
              type === ToolbarHeaderType.DIRECT_MESSAGE ||
              type === ToolbarHeaderType.CHANNEL_MEMBER
            ? '#363bd680'
            : 'linear-gradient(90deg, #e8514980, #363bd680)',
      }}
    >
      <Box mr={2}>
        {type === ToolbarHeaderType.SOCIAL && <Diversity3 fontSize='large' />}
        {type === ToolbarHeaderType.DIRECT_MESSAGE && (
          <People fontSize='large' />
        )}
        {type === ToolbarHeaderType.CHANNEL_MEMBER && (
          <Groups fontSize='large' />
        )}
        {type === ToolbarHeaderType.LEADERBOARD && (
          <LeaderboardRounded fontSize='large' />
        )}
        {type === ToolbarHeaderType.ACHIEVEMENTS && (
          <EmojiEvents fontSize='large' />
        )}
        {type === ToolbarHeaderType.SETTINGS && <Settings fontSize='large' />}
      </Box>
      <Typography variant='h6'>{title}</Typography>
    </Toolbar>
  );
}
