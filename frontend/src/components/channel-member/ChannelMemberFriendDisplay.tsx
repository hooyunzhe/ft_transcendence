'use client';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import { Friend } from '@/types/FriendTypes';

interface FriendDisplayProps {
  friend: Friend;
  selected: number;
  selectCurrent: () => void;
  status?: string;
}

export default function FriendDisplay({
  selected,
  selectCurrent,
  friend,
}: FriendDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton
        selected={selected === friend.incoming_friend.id}
        onClick={selectCurrent}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar alt='' src={friend.incoming_friend.avatar_url} />
          </ListItemAvatar>
          <ListItemText primary={friend.incoming_friend.username} />
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
