'use client';
import {
  ChannelMembers,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useState } from 'react';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import BanListDisplay from './ChannelMemberBanListDisplay';
import { Button, Stack } from '@mui/material';
import callAPI from '@/lib/callAPI';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useNotification } from '@/lib/stores/useNotificationStore';

export function ChannelMemberUnbanPrompt() {
  const channelMembers = useChannelMembers();
  const { kickChannelMember } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const [selectedMember, setSelectedMember] = useState<ChannelMembers>();
  const { setDialogPrompt, resetDialog } = useDialogActions();
  const notif = useNotification(); // for my errors

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

  return (
    <Button
      onClick={() =>
        setDialogPrompt(
          true,
          'Unban List',
          'Unban whoever you want',
          'Cancel',
          resetDialog,
          'Unban user',
          handleUnbanMember,
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
          </Stack>,
        )
      }
    >
      Unban Channel Members
    </Button>
  );
}
