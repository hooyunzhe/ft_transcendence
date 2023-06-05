'use client';
import Friend from '@/types/Friend';
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
import FriendDisplay from './FriendDisplay';
import { Dispatch, SetStateAction } from 'react';

interface FriendDisplayProps {
  category: string;
  open: boolean;
  friends: Friend[];
  toggleDropdown: (category: string) => void;
  handleRequest: (
    request: Friend,
    action: 'accept' | 'reject' | 'delete',
  ) => void;
  selectedFriend: number;
  setSelectedFriend: Dispatch<SetStateAction<number>>;
  friendsStatus: { [key: number]: string };
}

export default function FriendDropdown({
  category,
  open,
  friends,
  toggleDropdown,
  handleRequest,
  selectedFriend,
  setSelectedFriend,
  friendsStatus,
}: FriendDisplayProps) {
  return (
    <>
      <Paper elevation={2}>
        <ListItemButton
          onClick={() => {
            toggleDropdown(category);
          }}
        >
          <ListItemIcon>
            {category === 'pending' && <MoveToInboxRounded />}
            {category === 'invited' && <OutboxRounded />}
            {category === 'friends' && <PeopleRounded />}
          </ListItemIcon>
          <ListItemText
            primary={category.charAt(0).toUpperCase() + category.slice(1)}
          ></ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Paper>
      <Collapse in={open && friends.length > 0} timeout='auto' unmountOnExit>
        <Stack
          width='100%'
          maxWidth={360}
          direction='column'
          justifyContent='center'
          spacing={1}
        >
          {friends.map((friend: Friend, index: number) =>
            category === 'friends' ? (
              <Paper key={index} elevation={2}>
                <ListItemButton
                  selected={selectedFriend === friend.id}
                  onClick={() => setSelectedFriend(friend.id)}
                >
                  <FriendDisplay
                    category={category}
                    friend={friend}
                    status={friendsStatus[friend.incoming_friend.id]}
                    handleAction={handleRequest}
                  ></FriendDisplay>
                </ListItemButton>
              </Paper>
            ) : (
              <Paper key={index} elevation={2} sx={{ p: '8px 16px' }}>
                <FriendDisplay
                  category={category}
                  friend={friend}
                  handleAction={handleRequest}
                ></FriendDisplay>
              </Paper>
            ),
          )}
        </Stack>
      </Collapse>
    </>
  );
}
