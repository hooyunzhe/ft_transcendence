'use client';
import { Friend, FriendAction } from '@/types/FriendTypes';
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
import { useState } from 'react';
import { UserStatus } from '@/types/UserTypes';
import {
  useFriendActions,
  useFriends,
  useSelectedFriendID,
} from '@/lib/stores/useFriendStore';
import { useUserStatus } from '@/lib/stores/useUserStore';

interface FriendDropdownProps {
  category: string;
  handleAction: (request: Friend, action: FriendAction) => void;
}

export default function FriendDropdown({
  category,
  handleAction,
}: FriendDropdownProps) {
  const friends = useFriends();
  const selectedFriendID = useSelectedFriendID();
  const { setSelectedFriendID } = useFriendActions();
  const userStatus = useUserStatus();
  const [open, setOpen] = useState(category === 'blocked' ? false : true);
  const sortOrder = {
    [UserStatus.IN_GAME]: 0,
    [UserStatus.ONLINE]: 1,
    [UserStatus.OFFLINE]: 2,
  };

  function toggleOpen(): void {
    setOpen(!open);
  }

  function sortFriends(a: Friend, b: Friend): number {
    if (category === 'friends') {
      const userStatusA = userStatus[a.incoming_friend.id];
      const userStatusB = userStatus[b.incoming_friend.id];

      if (userStatusA !== userStatusB) {
        return sortOrder[userStatusA] - sortOrder[userStatusB];
      }
    }
    return a.incoming_friend.username.localeCompare(b.incoming_friend.username);
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
      <Collapse in={open && friends.length > 0} timeout='auto' unmountOnExit>
        <Stack
          width='100%'
          direction='column'
          justifyContent='center'
          spacing={1}
        >
          {friends
            .filter((friend) => friend.status === category.toUpperCase())
            .sort(sortFriends)
            .map((friend, index) =>
              category === 'friends' ? (
                <Paper key={index} elevation={2}>
                  <ListItemButton
                    selected={selectedFriendID === friend.id}
                    onClick={() => setSelectedFriendID(friend.id)}
                  >
                    <FriendDisplay
                      category={category}
                      friend={friend}
                      status={userStatus[friend.incoming_friend.id]}
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
