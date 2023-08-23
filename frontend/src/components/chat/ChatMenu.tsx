'use client';
import { useState } from 'react';
import { Delete, Edit, MoreVert } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import callAPI from '@/lib/callAPI';
import { useChatActions } from '@/lib/stores/useChatStore';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { Message, MessageType } from '@/types/MessageTypes';

interface ChatMenuProps {
  message: Message;
  toggleEdit: () => void;
  isDeletable: boolean;
  isCurrentUser: boolean;
}

export default function ChatMenu({
  message,
  toggleEdit,
  isDeletable,
  isCurrentUser,
}: ChatMenuProps) {
  const { deleteMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();

  async function handleDelete(): Promise<void> {
    await callAPI('PATCH', 'messages', {
      id: message.id,
      type: MessageType.DELETED,
    });
    deleteMessage(message.id);
    emitToSocket(channelSocket, 'deleteMessage', message);
    setAnchorElement(undefined);
  }

  function handleClose(): void {
    setAnchorElement(undefined);
  }

  return (
    <>
      <IconButton
        edge='end'
        disabled={!isDeletable || message.type === MessageType.DELETED}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        open={anchorElement !== undefined}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {isCurrentUser && (
          <MenuItem
            dense
            onClick={() => {
              toggleEdit();
              handleClose();
            }}
          >
            <ListItemIcon>
              <Edit fontSize='small' />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {isDeletable && (
          <MenuItem dense onClick={handleDelete}>
            <ListItemIcon>
              <Delete fontSize='small' />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
