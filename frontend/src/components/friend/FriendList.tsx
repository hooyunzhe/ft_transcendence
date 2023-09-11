'use client';
import { Collapse, ListItemButton, Stack } from '@mui/material';
import FriendDisplay from './FriendDisplay';
import {
  useFriendActions,
  useFriends,
  useSelectedFriend,
} from '@/lib/stores/useFriendStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import {
  useCurrentUser,
  useCurrentPreference,
  useUserStatus,
} from '@/lib/stores/useUserStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
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
  const currentUser = useCurrentUser();
  const currentPreference = useCurrentPreference();
  const selectedFriend = useSelectedFriend();
  const userStatus = useUserStatus();
  const currentView = useCurrentView();
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

  function handleFriendSelect(friend: Friend): void {
    if (currentView === View.CHAT && selectedFriend?.id === friend.id) {
      setSelectedFriend(undefined);
      setSelectedChannel(undefined);
    } else {
      setSelectedFriend(friend);
      setCurrentView(View.CHAT);
      setSelectedDirectChannel(currentUser.id, friend.incoming_friend.id);
    }
  }

  return (
    <Collapse
      in={
        expand &&
        friends.some((friend) => friend.status === category.toUpperCase())
      }
      timeout={currentPreference.animations_enabled ? 'auto' : 0}
      unmountOnExit
      sx={{
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
              <ListItemButton
                key={index}
                sx={{
                  padding: '0',
                }}
                selected={selectedFriend?.id === friend.id ?? false}
                onClick={() => handleFriendSelect(friend)}
              >
                <FriendDisplay
                  category={category}
                  friend={friend}
                  status={userStatus[friend.incoming_friend.id]}
                  handleAction={handleAction}
                />
              </ListItemButton>
            ) : (
              <FriendDisplay
                key={index}
                category={category}
                friend={friend}
                handleAction={handleAction}
              />
            ),
          )}
      </Stack>
    </Collapse>
  );
}
