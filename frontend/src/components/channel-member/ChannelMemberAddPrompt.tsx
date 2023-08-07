'use client';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { useEffect, useState } from 'react';
import FriendDisplay from './ChannelMemberFriendDisplay';
import { useChannelMembers } from '@/lib/stores/useChannelMemberStore';
import { useFriends } from '@/lib/stores/useFriendStore';
import {
  useDialog,
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { Button, Stack } from '@mui/material';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { Channel } from '@/types/ChannelTypes';

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
  const [friendSearch, setFriendSearch] = useState('');
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
    <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
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
            <FriendDisplay
              key={index}
              selected={selectedFriend?.incoming_friend.id ?? 0}
              selectCurrent={() => {
                setFriendSearch(friend.incoming_friend.username);
                setSelectedFriend(friend);
              }}
              friend={friend}
            ></FriendDisplay>
          ))}
    </Stack>
  );
}
