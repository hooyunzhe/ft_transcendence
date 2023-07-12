import ChannelMembers, {
  ChannelMemberAction,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import BanListDisplay from './ChannelMemberBanListDisplay';
import { Stack } from '@mui/material';

interface ChannelMemberUnbanPromptProps {
  channelMembers: ChannelMembers[];
  handleAction: (...args: any) => Promise<void>;
}

export function ChannelMemberUnbanPrompt({
  channelMembers,
  handleAction,
}: ChannelMemberUnbanPromptProps) {
  const [selectedMember, setSelectedMember] = useState<
    ChannelMembers | undefined
  >();
  const [memberSearch, setMemberSearch] = useState('');
  const [altOpen, setAltOpen] = useState(false);

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
        handleAction(selectedMember, ChannelMemberAction.UNBAN);
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
