'use client';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { User } from '@/types/UserTypes';

interface ChannelMemberDisplayProps {
  stylesDisabled?: boolean;
  user: User;
}

export default function ChannelMemberDisplay({
  stylesDisabled,
  user,
}: ChannelMemberDisplayProps) {
  return (
    <ListItem
      {...(stylesDisabled === undefined && {
        sx: {
          border: 'solid 3px #4a4eda',
          borderRadius: '10px',
          bgcolor: '#A4B5C6',
        },
      })}
    >
      <ListItemAvatar>
        <Avatar src={user.avatar_url} />
      </ListItemAvatar>
      <ListItemText primary={user.username} />
    </ListItem>
  );
}
