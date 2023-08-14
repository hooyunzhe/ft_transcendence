'use client';
import { Collapse, ListItemButton, Paper, Stack } from '@mui/material';
import FriendDisplay from './FriendDisplay';
import {
  useFriendActions,
  useFriends,
  useSelectedFriend,
} from '@/lib/stores/useFriendStore';
import {
  useChannelActions,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import { useUserStatus } from '@/lib/stores/useUserStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { Friend, FriendAction } from '@/types/FriendTypes';
import { UserStatus } from '@/types/UserTypes';
import { FriendCategory, View } from '@/types/UtilTypes';

interface FriendListProps {
  expand: boolean;
  category: FriendCategory;
  handleAction: (request: Friend, action: FriendAction) => void;
}

export default function FriendList({
  expand,
  category,
  handleAction,
}: FriendListProps) {
  const friends = useFriends();
  const selectedFriend = useSelectedFriend();
  const selectedChannel = useSelectedChannel();
  const userStatus = useUserStatus();
  const { setSelectedFriend } = useFriendActions();
  const { setSelectedChannel, setSelectedDirectChannel } = useChannelActions();
  const { setCurrentView } = useUtilActions();
  const sortOrder = {
    [UserStatus.IN_GAME]: 0,
    [UserStatus.ONLINE]: 1,
    [UserStatus.OFFLINE]: 2,
  };

  function sortFriends(a: Friend, b: Friend): number {
    if (category === FriendCategory.FRIENDS) {
      const userStatusA = userStatus[a.incoming_friend.id];
      const userStatusB = userStatus[b.incoming_friend.id];

      if (userStatusA !== userStatusB) {
        return sortOrder[userStatusA] - sortOrder[userStatusB];
      }
    }
    return a.incoming_friend.username.localeCompare(b.incoming_friend.username);
  }

  return (
    <Collapse
      in={
        expand &&
        friends.some((friend) => friend.status === category.toUpperCase())
      }
      timeout='auto'
      unmountOnExit
      sx={{
        p: '2px',
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
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
            category === FriendCategory.FRIENDS ? (
              <Paper key={index} elevation={2}>
                <ListItemButton
                  selected={selectedFriend?.id === friend.id ?? false}
                  onClick={() => {
                    if (selectedFriend?.id === friend.id) {
                      setSelectedFriend(undefined);
                      setSelectedChannel(undefined);
                    } else {
                      setSelectedFriend(friend);
                      if (selectedChannel === undefined) {
                        setCurrentView(View.CHAT);
                      }
                      setSelectedDirectChannel(friend.incoming_friend.id);
                    }
                  }}
                >
                  <FriendDisplay
                    category={category}
                    friend={friend}
                    status={userStatus[friend.incoming_friend.id]}
                    handleAction={handleAction}
                  />
                </ListItemButton>
              </Paper>
            ) : (
              <Paper key={index} elevation={2} sx={{ p: '8px 16px' }}>
                <FriendDisplay
                  category={category}
                  friend={friend}
                  handleAction={handleAction}
                />
              </Paper>
            ),
          )}
      </Stack>
    </Collapse>
  );
}
