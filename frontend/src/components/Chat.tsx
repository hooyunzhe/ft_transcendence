'use client';

import { ListItem, ListItemText } from '@mui/material';
import { Message } from '@/types/Message';
import './Chat.css';

export default function Chat({
  id,
  content,
  type,
  date_of_creation,
  channel,
  user,
}: Message) {
  return (
    <ListItem>
      {/* Where we have to put our chat box contents */}
      <ListItemText primary={`${user.username}: ${content}`}></ListItemText>
    </ListItem>
  );
}
