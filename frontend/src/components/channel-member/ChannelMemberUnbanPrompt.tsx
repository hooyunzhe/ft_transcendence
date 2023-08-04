'use client';
import {
  ChannelMembers,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useEffect, useState } from 'react';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import BanListDisplay from './ChannelMemberBanListDisplay';
import { Button, Stack } from '@mui/material';
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
import { useNotification } from '@/lib/stores/useNotificationStore';

export function ChannelMemberUnbanPrompt() {
  const channelMembers = useChannelMembers();
  const { kickChannelMember } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const [selectedMember, setSelectedMember] = useState<ChannelMembers>();
  const { resetDialog } = useDialogActions();
  const notif = useNotification(); // for my errors
  const { actionClicked, backClicked } = useDialogTriggers();

  const [memberSearch, setMemberSearch] = useState('');

  async function kickMember(memberID: number): Promise<string> {
    await callAPI('DELETE', 'channel-members', { id: memberID });
    kickChannelMember(memberID);
    return '';
  }

  async function handleUnbanMember() {
    if (!selectedMember) {
      throw 'User does not exist';
    }

    return displayConfirmation(
      'Unban ' + selectedMember.user.username + '?',
      'You are unbanning this user from this channel.',
      selectedMember.id,
      kickMember,
    );
  }

  useEffect(() => {
    if (actionClicked) {
      handleUnbanMember().then(() => resetDialog());
    }

    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
      {channelMembers
        .filter((member) => {
          return member.status === ChannelMemberStatus.BANNED;
        })
        .map((member: ChannelMembers, index: number) => (
          <BanListDisplay
            key={index}
            selected={selectedMember?.id ?? 0}
            selectCurrent={() => {
              setSelectedMember(member);
            }}
            member={member}
          ></BanListDisplay>
        ))}
    </Stack>
  );
}
