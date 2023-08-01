'use client';
import { useState } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  MoveToInboxRounded,
  OutboxRounded,
  PeopleRounded,
  PersonOff,
} from '@mui/icons-material';
import FriendList from './FriendList';
import { Friend, FriendAction } from '@/types/FriendTypes';

interface FriendDropdownProps {
  category: string;
  handleAction: (request: Friend, action: FriendAction) => void;
}

export default function FriendDropdown({
  category,
  handleAction,
}: FriendDropdownProps) {
  const [open, setOpen] = useState(category === 'blocked' ? false : true);

  function toggleOpen(): void {
    setOpen(!open);
  }

  return (
    <>
      <Paper elevation={2}>
        <ListItemButton onClick={toggleOpen}>
          <ListItemIcon>
            {category === 'friends' && <PeopleRounded />}
            {category === 'pending' && <MoveToInboxRounded />}
            {category === 'invited' && <OutboxRounded />}
            {category === 'blocked' && <PersonOff />}
          </ListItemIcon>
          <ListItemText
            primary={category.charAt(0).toUpperCase() + category.slice(1)}
          ></ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Paper>
      <FriendList
        expand={open}
        category={category}
        handleAction={handleAction}
      />
    </>
  );
}
