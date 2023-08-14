'use client';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { User } from '@/types/UserTypes';

interface ChannelMemberDisplayProps {
  user: User;
  role?: ChannelMemberRole;
}

export default function ChannelMemberDisplay({
  user,
  role,
}: ChannelMemberDisplayProps) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.avatar_url} />
      </ListItemAvatar>
      <ListItemText
        primary={user.username}
        secondary={'User Id: ' + user.id + (role ? ' role: ' + role : '')}
      />
    </ListItem>
  );
}
