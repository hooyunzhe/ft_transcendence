'use client';
import {
  ChannelMembers,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useEffect, useState } from 'react';
import { ListItemButton, Paper, Stack } from '@mui/material';
import callAPI from '@/lib/callAPI';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import ChannelMemberDisplay from './ChannelMemberDisplay';

export function ChannelMemberUnbanPrompt() {
  const channelMembers = useChannelMembers();
  const channelSocket = useChannelSocket();
  const { kickChannelMember } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [selectedMember, setSelectedMember] = useState<
    ChannelMembers | undefined
  >();

  async function kickMember(member: ChannelMembers): Promise<void> {
    await callAPI('DELETE', 'channel-members', { id: member.id });
    kickChannelMember(member.id);
    emitToSocket(channelSocket, 'kickMember', member);
  }

  async function handleUnbanMember() {
    if (!selectedMember) {
      throw 'Please select a member';
    }

    return displayConfirmation(
      'Unban ' + selectedMember.user.username + '?',
      'You are unbanning this user from this channel.',
      selectedMember,
      kickMember,
    );
  }

  useEffect(() => {
    if (actionClicked) {
      handleUnbanMember()
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
      {channelMembers
        .filter((member) => member.status === ChannelMemberStatus.BANNED)
        .map((member: ChannelMembers, index: number) => (
          <Paper key={index} elevation={2}>
            <ListItemButton
              selected={selectedMember?.id === member.id ?? false}
              onClick={() =>
                selectedMember?.id === member.id
                  ? setSelectedMember(undefined)
                  : setSelectedMember(member)
              }
            >
              <ChannelMemberDisplay user={member.user} />
            </ListItemButton>
          </Paper>
        ))}
    </Stack>
  );
}
