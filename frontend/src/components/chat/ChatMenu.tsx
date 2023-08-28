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
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useChannelMemberChecks } from '@/lib/stores/useChannelMemberStore';
import { Message, MessageType } from '@/types/MessageTypes';

interface ChatMenuProps {
  message: Message;
  open: boolean;
  handleDelete: () => Promise<void>;
  handleOpen: () => void;
  handleClose: () => void;
}

export default function ChatMenu({
  message,
  open,
  handleDelete,
  handleOpen,
  handleClose,
}: ChatMenuProps) {
  const currentUser = useCurrentUser();
  const { setSelectedMessage } = useChatActions();
  const { isMessageDeletable } = useChannelMemberChecks();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();

  return (
    <>
      <IconButton
        edge='end'
        onMouseDown={(event) => event.preventDefault()}
        disabled={
          !isMessageDeletable(
            currentUser.id,
            message.user.id,
            message.channel.id,
          ) || message.type === MessageType.DELETED
        }
        onClick={(event) => {
          setAnchorElement(event.currentTarget);
          handleOpen();
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        disableAutoFocusItem
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {currentUser.id === message.user.id && (
          <MenuItem
            dense
            onClick={() => {
              setSelectedMessage(message);
              handleClose();
            }}
          >
            <ListItemIcon>
              <Edit fontSize='small' />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {isMessageDeletable(
          currentUser.id,
          message.user.id,
          message.channel.id,
        ) && (
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
