'use client';
import Friend from '@/types/Friend';
import {
  ExpandLess,
  ExpandMore,
  MoveToInboxRounded,
  OutboxRounded,
  PeopleRounded,
  PersonOff,
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

interface FriendDropdownProps {
  category: string;
  open: boolean;
  friends: Friend[];
  toggleDropdown: (category: string) => void;
  handleAction: (
    request: Friend,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
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
  handleAction,
  selectedFriend,
  setSelectedFriend,
  friendsStatus,
}: FriendDropdownProps) {
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
            {category === 'blocked' && <PersonOff />}
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
                    handleAction={handleAction}
                  ></FriendDisplay>
                </ListItemButton>
              </Paper>
            ) : (
              <Paper key={index} elevation={2} sx={{ p: '8px 16px' }}>
                <FriendDisplay
                  category={category}
                  friend={friend}
                  handleAction={handleAction}
                ></FriendDisplay>
              </Paper>
            ),
          )}
        </Stack>
      </Collapse>
    </>
  );
}
