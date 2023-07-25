'use client';
import { MessageType } from '@/types/MessageTypes';
import { User } from '@/types/UserTypes';
import { ListItem, ListItemText, Paper } from '@mui/material';

interface ChatDisplayProps {
  content: string;
  type: MessageType;
  dateOfCreation: Date;
  user: User;
}

export default function ChatDisplay({
  content,
  type,
  dateOfCreation,
  user,
}: ChatDisplayProps) {
  return (
    <Paper>
      <ListItem>
        <ListItemText primary={content}></ListItemText>
      </ListItem>
    </Paper>
  );
}
