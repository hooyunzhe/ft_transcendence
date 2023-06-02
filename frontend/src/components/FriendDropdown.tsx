'use client';
import {
  ExpandLess,
  ExpandMore,
  MoveToInboxRounded,
  OutboxRounded,
  PeopleRounded,
} from '@mui/icons-material';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface FriendDisplayProps {
  children: ReactNode;
  category: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FriendDropdown({
  children,
  category,
  open,
  setOpen,
}: FriendDisplayProps) {
  return (
    <>
      <Paper elevation={2}>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemIcon>
            {category === 'Pending' && <MoveToInboxRounded />}
            {category === 'Sent' && <OutboxRounded />}
            {category === 'Friends' && <PeopleRounded />}
          </ListItemIcon>
          <ListItemText primary={category}></ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Paper>
      {children}
    </>
  );
}
