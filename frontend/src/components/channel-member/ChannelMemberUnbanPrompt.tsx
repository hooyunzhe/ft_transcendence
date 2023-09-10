'use client';
import { useEffect, useState } from 'react';
import { ListItemButton, Stack } from '@mui/material';
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
    displayNotification(
      'success',
      `Channel member ${member.user.username} unbanned`,
    );
  }

  async function handleUnbanMember(): Promise<void> {
    return displayConfirmation(
      'Unban ' + selectedMemberToUnban?.user.username + '?',
      `You are unbanning this ${selectedMemberToUnban?.user.username} from this channel.`,
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
    <Stack
      maxHeight={200}
      spacing={1}
      sx={{
        p: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {unbannableMembers.map((member: ChannelMember, index: number) => (
        <ListItemButton
          key={index}
          disableGutters
          sx={{
            border: 'solid 3px #4a4eda',
            borderRadius: '10px',
            bgcolor: '#7E8E9E80',
          }}
          selected={selectedMemberToUnban?.id === member.id ?? false}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setSelectedMemberToUnban(
              member.id === selectedMemberToUnban?.id ? undefined : member,
            );
            setActionButtonDisabled(member.id === selectedMemberToUnban?.id);
          }}
        >
          <ChannelMemberDisplay user={member.user} />
        </ListItemButton>
      ))}
    </Stack>
  );
}
