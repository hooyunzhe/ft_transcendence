'use client';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { User } from '@/types/UserTypes';

interface ChannelMemberDisplayProps {
  user: User;
}

export default function ChannelMemberDisplay({
  user,
}: ChannelMemberDisplayProps) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.avatar_url} />
      </ListItemAvatar>
      <ListItemText primary={user.username} />
    </ListItem>
  );
}
