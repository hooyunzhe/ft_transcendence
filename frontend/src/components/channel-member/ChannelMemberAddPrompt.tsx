'use client';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { useEffect, useState } from 'react';
import { useChannelMembers } from '@/lib/stores/useChannelMemberStore';
import { useFriends } from '@/lib/stores/useFriendStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { ListItemButton, Paper, Stack } from '@mui/material';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { Channel } from '@/types/ChannelTypes';
import ChannelMemberDisplay from './ChannelMemberDisplay';

interface ChannelMemberAddPromptProps {
  addUser: (...args: any) => Promise<string>;
  selectedChannel: Channel;
}

export function ChannelMemberAddPrompt({
  addUser,
  selectedChannel,
}: ChannelMemberAddPromptProps) {
  const channelMembers = useChannelMembers();
  const friends = useFriends();
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { displayNotification } = useNotificationActions();

  async function handleAddMemberAction(): Promise<void> {
    if (selectedFriend === undefined) {
      throw "Friend doesn't exist";
    }
    const friendToJoin = friends.find(
      (friend) => friend.id === selectedFriend.id,
    );

    if (!friendToJoin) {
      throw 'Invalid friend name!';
    }
    addUser(friendToJoin.incoming_friend.id, selectedChannel.hash);
  }

  useEffect(() => {
    if (actionClicked) {
      handleAddMemberAction()
        .then(() => resetDialog())
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <Stack
      maxHeight={200}
      spacing={1}
      sx={{
        p: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {friends.length > 0 &&
        friends
          .filter(
            (friend) =>
              friend.status === FriendStatus.FRIENDS &&
              channelMembers.every((member) => {
                return (
                  member.user.id !== friend.incoming_friend.id ||
                  member.channel.id !== selectedChannel.id
                );
              }),
          )
          .map((friend: Friend, index: number) => (
            <Paper key={index} elevation={2}>
              <ListItemButton
                selected={selectedFriend?.id === friend.id ?? false}
                onClick={() =>
                  selectedFriend?.id === friend.id
                    ? setSelectedFriend(undefined)
                    : setSelectedFriend(friend)
                }
              >
                <ChannelMemberDisplay user={friend.incoming_friend} />
              </ListItemButton>
            </Paper>
          ))}
    </Stack>
  );
}
