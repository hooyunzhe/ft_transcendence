import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { Stack } from '@mui/material';
import { ChannelDisplay } from './ChannelDisplay';

interface ChannelJoinPromptProps {
  channels: Channel[];
  joinChannel: (...args: any) => Promise<string>;
}

export default function ChannelJoinPrompt({
  channels,
  joinChannel,
}: ChannelJoinPromptProps) {
  const [channelSearch, setChannelSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();
  const [channelPass, setChannelPass] = useState('');
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);

  function resetDisplay() {
    setDisplayPasswordPrompt(false);
  }

  function resetState() {
    setChannelSearch('');
    setSelectedChannel(undefined);
    setChannelPass('');
  }

  async function handleJoinChannelAction(): Promise<string> {
    const channelToJoin = channels.find(
      (channel) => channel.id === selectedChannel?.id,
    );

    if (!channelToJoin) {
      return "Channel doesn't exist";
    }

    if (channelToJoin.type === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      joinChannel(selectedChannel?.id);
      resetState();
    }
    return '';
  }

  return displayPasswordPrompt ? (
    <DialogPrompt
      buttonText='Join channel'
      dialogTitle='Enter channel password'
      dialogDescription='Join channel using password'
      labelText='Password'
      textInput={channelPass}
      onChangeHandler={(input) => {
        setChannelPass(input);
      }}
      backButtonText='Back'
      backHandler={resetDisplay}
      actionButtonText='Join'
      handleAction={async () => {
        const res = joinChannel(selectedChannel?.id);
        resetState();
        resetDisplay();
        return res;
      }}
    />
  ) : (
    <DialogPrompt
      buttonText='Join channel'
      dialogTitle='Search channels'
      dialogDescription='Find a channel to join'
      labelText='Channel name'
      textInput={channelSearch}
      onChangeHandler={(input) => {
        setSelectedChannel(undefined);
        setChannelSearch(input);
      }}
      backButtonText='Cancel'
      backHandler={resetDisplay}
      actionButtonText={
        selectedChannel?.type === ChannelType.PROTECTED ? 'Next' : 'Join'
      }
      handleAction={handleJoinChannelAction}
    >
      <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
        {channels
          .filter((channel) =>
            channel.name
              .toLowerCase()
              .includes(channelSearch.trim().toLowerCase()),
          )
          .map((channel: Channel, index: number) => (
            <ChannelDisplay
              key={index}
              {...channel}
              selected={selectedChannel?.id ?? 0}
              selectCurrent={() => {
                setChannelSearch(channel.name);
                setSelectedChannel(channel);
              }}
            />
          ))}
      </Stack>
    </DialogPrompt>
  );
}
