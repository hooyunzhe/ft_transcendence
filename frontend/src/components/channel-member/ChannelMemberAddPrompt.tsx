'use client';
import { useEffect, useState } from 'react';
import { ListItemButton, Paper, Stack } from '@mui/material';
import ChannelMemberDisplay from './ChannelMemberDisplay';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { Friend } from '@/types/FriendTypes';
import { Channel } from '@/types/ChannelTypes';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';

interface ChannelMemberAddPromptProps {
  addableFriends: Friend[];
  selectedChannel: Channel;
}

export function ChannelMemberAddPrompt({
  addableFriends,
  selectedChannel,
}: ChannelMemberAddPromptProps) {
  const currentUser = useCurrentUser();
  const channelSocket = useChannelSocket();
  const { addChannelMember } = useChannelMemberActions();
  const { setActionButtonDisabled, resetDialog, resetTriggers } =
    useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [selectedFriendToJoin, setSelectedFriendToJoin] = useState<
    Friend | undefined
  >();
  const { handleAchievementsEarned } = useAchievementActions();

  async function handleAddMemberAction(): Promise<void> {
    if (selectedFriendToJoin) {
      const newChannelMember = await callAPI('POST', 'channel-members', {
        channel_id: selectedChannel?.id,
        user_id: selectedFriendToJoin.incoming_friend.id,
        role: ChannelMemberRole.MEMBER,
        hash: selectedChannel.hash,
      }).then((res) => res.body);

      if (newChannelMember) {
        addChannelMember(newChannelMember);
        emitToSocket(channelSocket, 'newMember', newChannelMember);
        await handleAchievementsEarned(
          currentUser.id,
          3,
          displayNotification,
        ).then(
          (earned) =>
            earned &&
            displayNotification(
              'success',
              `${newChannelMember.user.username} added`,
            ),
        );
      } else {
        throw 'FATAL ERROR: FAILED TO ADD CHANNEL MEMBER IN BACKEND';
      }
    } else {
      throw 'FATAL ERROR: FAILED TO ADD DUE TO MISSING SELECTED FRIEND TO ADD';
    }
  }

  useEffect(() => {
    if (actionClicked) {
      handleAddMemberAction()
        .then(resetDialog)
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
      {addableFriends.map((friend: Friend, index: number) => (
        <Paper key={index} elevation={2}>
          <ListItemButton
            selected={selectedFriendToJoin?.id === friend.id ?? false}
            onClick={() => {
              setSelectedFriendToJoin(
                friend.id === selectedFriendToJoin?.id ? undefined : friend,
              );
              setActionButtonDisabled(friend.id === selectedFriendToJoin?.id);
            }}
          >
            <ChannelMemberDisplay user={friend.incoming_friend} />
          </ListItemButton>
        </Paper>
      ))}
    </Stack>
  );
}
