'use client';
import { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { Clear, Done } from '@mui/icons-material';
import InputField from '../utils/InputField';
import ChatMenu from './ChatMenu';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChatActions, useSelectedMessage } from '@/lib/stores/useChatStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { Message, MessageType } from '@/types/MessageTypes';
import { View } from '@/types/UtilTypes';

interface ChatDisplayProps {
  message: Message;
}

export default function ChatDisplay({ message }: ChatDisplayProps) {
  const selectedMessage = useSelectedMessage();
  const channelSocket = useChannelSocket();
  const { editMessage, deleteMessage, setSelectedMessage } = useChatActions();
  const { displayConfirmation } = useConfirmationActions();
  const { setSelectedStatistic } = useProfileActions();
  const { setCurrentView } = useUtilActions();
  const [input, setInput] = useState(message.content);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleAvatarClick(): void {
    setSelectedStatistic(message.user.id);
    setCurrentView(View.PROFILE);
  }

  async function handleEdit(): Promise<void> {
    if (input.length === 0) {
      handleDelete();
    } else if (input.trim().length === 0) {
      handleCancel();
    } else {
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
      setMenuOpen(false);
      setSelectedMessage(undefined);
    }
  }

  async function handleDelete(): Promise<void> {
    displayConfirmation(
      'Delete message?',
      'You are deleting this message, which is irreversible!',
      null,
      async () => {
        await callAPI('PATCH', 'messages', {
          id: message.id,
          type: MessageType.DELETED,
        });
        deleteMessage(message.id);
        emitToSocket(channelSocket, 'deleteMessage', message);
        setMenuOpen(false);
        setSelectedMessage(undefined);
      },
    );
  }

  function handleCancel(): void {
    setInput(message.content);
    setSelectedMessage(undefined);
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography color='#DDDDDD'>{message.user.username}</Typography>
      <Box borderRadius='10px' bgcolor='#A4B5C6'>
        <ListItem
          sx={{
            padding: '0 1vh',
          }}
        >
          <ListItemAvatar>
            <Avatar
              src={message.user.avatar_url}
              alt={message.user.username}
              sx={{
                border: 'solid 1px black',
              }}
              onClick={handleAvatarClick}
            />
          </ListItemAvatar>
          {selectedMessage?.id === message.id ? (
            <InputField
              normalMargin
              ignoreError
              handleEnterInput
              label=''
              value={input}
              onChange={setInput}
              onSubmit={handleEdit}
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
              <IconButton
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleEdit}
              >
                <Done fontSize='small' />
              </IconButton>
              <IconButton
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleCancel}
              >
                <Clear fontSize='small' />
              </IconButton>
            </>
          ) : (
            <ChatMenu
              message={message}
              open={menuOpen}
              handleDelete={handleDelete}
              handleOpen={() => setMenuOpen(true)}
              handleClose={() => setMenuOpen(false)}
            />
          )}
        </ListItem>
      </Box>
    </Box>
  );
}
