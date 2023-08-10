'use client';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Message, MessageType } from '@/types/MessageTypes';
import ChatMenu from './ChatMenu';
import { useState } from 'react';
import { Clear, Done } from '@mui/icons-material';
import { useChatActions, useSelectedMessage } from '@/lib/stores/useChatStore';
import callAPI from '@/lib/callAPI';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import emitToSocket from '@/lib/emitToSocket';

interface ChatDisplayProps {
  message: Message;
}

export default function ChatDisplay({ message }: ChatDisplayProps) {
  const selectedMessage = useSelectedMessage();
  const { editMessage, setSelectedMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const [input, setInput] = useState(message.content);

  async function handleEdit(): Promise<void> {
    await callAPI('PATCH', 'messages', {
      id: message.id,
      content: input,
    });
    editMessage(message.id, input);
    emitToSocket(channelSocket, 'editMessage', {
      messageID: message.id,
      channelID: message.channel.id,
      content: input,
    });
    setSelectedMessage(undefined);
  }

  function handleCancel(): void {
    setInput('');
    setSelectedMessage(undefined);
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography color='white'>{message.user.username}</Typography>
      <Paper>
        <ListItem
          sx={{
            padding: '0 1vh',
          }}
        >
          <ListItemAvatar>
            <Avatar src={message.user.avatar_url} />
          </ListItemAvatar>
          {selectedMessage?.id === message.id ? (
            <TextField
              hiddenLabel
              autoFocus
              autoComplete='off'
              margin='normal'
              variant='standard'
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          ) : (
            <ListItemText
              primary={
                message.type === MessageType.TEXT
                  ? message.content
                  : 'Message deleted'
              }
              primaryTypographyProps={{
                fontStyle:
                  message.type === MessageType.DELETED ? 'italic' : 'normal',
                sx: { wordBreak: 'break-all' },
              }}
              secondary={
                (message.type === MessageType.TEXT &&
                new Date(message.last_updated) >
                  new Date(message.date_of_creation)
                  ? 'edited '
                  : '') +
                new Date(message.last_updated).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })
              }
              secondaryTypographyProps={{ align: 'right' }}
            />
          )}
          {selectedMessage?.id === message.id ? (
            <>
              <IconButton onClick={handleEdit}>
                <Done fontSize='small' />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <Clear fontSize='small' />
              </IconButton>
            </>
          ) : (
            <ChatMenu
              message={message}
              toggleEdit={() => setSelectedMessage(message)}
            />
          )}
        </ListItem>
      </Paper>
    </Box>
  );
}
