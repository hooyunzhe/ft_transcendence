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
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { ChannelMember } from '@/types/ChannelMemberTypes';

interface ChannelMemberUnbanPromptProps {
  unbannableMembers: ChannelMember[];
}

export default function ChannelMemberUnbanPrompt({
  unbannableMembers,
}: ChannelMemberUnbanPromptProps) {
  const channelSocket = useChannelSocket();
  const { kickChannelMember } = useChannelMemberActions();
  const { setActionButtonDisabled, resetDialog, resetTriggers } =
    useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();
  const [selectedMemberToUnban, setSelectedMemberToUnban] = useState<
    ChannelMember | undefined
  >();

  async function kickMember(member: ChannelMember): Promise<void> {
    await callAPI('DELETE', 'channel-members', { id: member.id });
    kickChannelMember(member.id);
    emitToSocket(channelSocket, 'kickMember', member);
  }

  async function handleUnbanMember(): Promise<void> {
    return displayConfirmation(
      'Unban ' + selectedMemberToUnban?.user.username + '?',
      'You are unbanning this user from this channel.',
      selectedMemberToUnban,
      kickMember,
    );
  }

  useEffect(() => {
    if (actionClicked) {
      handleUnbanMember()
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
    <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
      {unbannableMembers.map((member: ChannelMember, index: number) => (
        <Paper key={index} elevation={2}>
          <ListItemButton
            selected={selectedMemberToUnban?.id === member.id ?? false}
            onClick={() => {
              setSelectedMemberToUnban(
                member.id === selectedMemberToUnban?.id ? undefined : member,
              );
              setActionButtonDisabled(member.id === selectedMemberToUnban?.id);
            }}
          >
            <ChannelMemberDisplay user={member.user} />
          </ListItemButton>
        </Paper>
      ))}
    </Stack>
  );
}
