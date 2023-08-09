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
import { Message } from '@/types/MessageTypes';

interface ChatMenuProps {
  message: Message;
  toggleEdit: () => void;
}

export default function ChatMenu({ message, toggleEdit }: ChatMenuProps) {
  const { deleteMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();

  async function handleDelete(): Promise<void> {
    await callAPI('DELETE', 'messages', {
      id: message.id,
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
        onClick={(event) => setAnchorElement(event.currentTarget)}
        edge='end'
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
        <MenuItem dense onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
