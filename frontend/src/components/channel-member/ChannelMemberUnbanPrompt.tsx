'use client';
import {
  ChannelMembers,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useState } from 'react';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import BanListDisplay from './ChannelMemberBanListDisplay';
import { Stack } from '@mui/material';
import callAPI from '@/lib/callAPI';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';

export function ChannelMemberUnbanPrompt() {
  const channelMembers = useChannelMembers();
  const { kickChannelMember } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const [selectedMember, setSelectedMember] = useState<
    ChannelMembers | undefined
  >();
  const [memberSearch, setMemberSearch] = useState('');
  const [altOpen, setAltOpen] = useState(false);

  async function kickMember(memberID: number): Promise<string> {
    await callAPI('DELETE', 'channel-members', { id: memberID });
    kickChannelMember(memberID);
    return '';
  }

  async function unbanChannelMember(member: ChannelMembers) {
    return displayConfirmation(
      'Unban ' + member.user.username + '?',
      'You are unbanning this user from this channel.',
      member.id,
      kickMember,
    );
  }

  return (
    <DialogPrompt
      altOpen={altOpen}
      resetAltOpen={() => {
        setAltOpen(false);
      }}
      buttonText='Unban User'
      dialogTitle='Ban list'
      dialogDescription='Please unban the users you desire'
      labelText='username'
      textInput={memberSearch}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setMemberSearch(input);
        setSelectedMember(undefined);
      }}
      backHandler={async () => {}}
      actionButtonText='Unban'
      handleAction={async () => {
        if (selectedMember) {
          unbanChannelMember(selectedMember);
        }
        setMemberSearch('');
        return '';
      }}
    >
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
                setMemberSearch(member.user.username);
                setSelectedMember(member);
              }}
              member={member}
            ></BanListDisplay>
          ))}
      </Stack>
    </DialogPrompt>
  );
}
