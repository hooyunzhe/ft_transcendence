import ChannelMembers, {
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import BanListDisplay from './ChannelMemberBanListDisplay';
import { Stack } from '@mui/material';

interface ChannelMemberAddPromptProps {
  kickUser: (...args: any) => Promise<string>;
  channelMembers: ChannelMembers[];
}

export function ChannelMemberAddPrompt({
  kickUser,
  channelMembers,
}: ChannelMemberAddPromptProps) {
  const [selectedMember, setSelectedMember] = useState<
    ChannelMembers | undefined
  >();
  const [memberSearch, setMemberSearch] = useState('');

  async function handleUnbanMemberAction(): Promise<string> {
    if (selectedMember === undefined) {
      return "Banned user doesn't exist";
    }
    const UserToUnban = channelMembers.find(
      (member) => member.id === selectedMember.id,
    );

    if (!UserToUnban) {
      return 'Invalid friend name!';
    }
    return kickUser(UserToUnban.id);
  }
  // ** !! PROBABLY NEED A CONFIRMATION PROMPT IN THIS ** !! //

  return (
    <DialogPrompt
      buttonText='Add members button'
      dialogTitle='Add members'
      dialogDescription='Add your friends to the channel'
      labelText='username'
      textInput={memberSearch}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setMemberSearch(input);
        setSelectedMember(undefined);
      }}
      backHandler={async () => {}}
      actionButtonText='Add'
      handleAction={async () => {
        const response = await handleUnbanMemberAction();

        console.log('response: ' + response);
        if (!response) {
          setMemberSearch('');
          setSelectedMember(undefined);
        }
        return response;
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
