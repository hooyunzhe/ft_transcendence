'use client';
import { Friend } from '@/types/Friend';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface FriendDisplayProps {
  friend: Friend;
  selectedFriend: number;
  setSelectedFriend: Dispatch<SetStateAction<number>>;
}

export function FriendDisplay({
  friend,
  selectedFriend,
  setSelectedFriend,
}: FriendDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton
        selected={selectedFriend === friend.id}
        onClick={() => setSelectedFriend(friend.id)}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={friend.incoming_friend.username + ' (' + friend.id + ')'}
          />
          <ListItemText
            sx={{ textAlign: 'center' }}
            secondary={friend.status}
          />
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
