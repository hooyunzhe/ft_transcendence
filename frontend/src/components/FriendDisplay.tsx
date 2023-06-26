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
  status?: string;
}

export default function FriendDisplay({ friend }: FriendDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton
      // selected={selected === id} onClick={selectCurrent}
      >
        <ListItem
        // sx={{
        //   ...(category === 'friends' && {
        //     opacity: status === 'online' ? '100%' : '20%',
        //   }),
        // }}
        >
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText primary={friend.incoming_friend.username} />
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
