'use client';
import { MessageType } from '@/types/MessageTypes';
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

interface ChatDisplayProps {
  content: string;
  type: MessageType;
  dateOfCreation: string;
  senderName: string;
}

export default function ChatDisplay({
  content,
  type,
  dateOfCreation,
  senderName,
}: ChatDisplayProps) {
  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography color='white'>{senderName}</Typography>
      <Paper>
        <ListItem
          sx={{
            padding: '0 1vh',
          }}
        >
          <ListItemAvatar>
            <Avatar alt='' />
          </ListItemAvatar>
          <ListItemText
            primary={content}
            secondary={new Date(dateOfCreation).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
            })}
            secondaryTypographyProps={{ align: 'right' }}
          ></ListItemText>
        </ListItem>
      </Paper>
    </Box>
  );
}
