'use client';
import {
  ExpandLess,
  ExpandMore,
  MoveToInboxRounded,
  OutboxRounded,
  PeopleRounded,
} from '@mui/icons-material';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
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
            {category === 'Invited' && <OutboxRounded />}
            {category === 'Friends' && <PeopleRounded />}
          </ListItemIcon>
          <ListItemText primary={category}></ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Paper>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Stack
          width='100%'
          maxWidth={360}
          direction='column'
          justifyContent='center'
          spacing={1}
        >
          {children}
        </Stack>
      </Collapse>
    </>
  );
}
