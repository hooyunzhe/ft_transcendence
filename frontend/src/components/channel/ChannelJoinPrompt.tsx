import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { Stack } from '@mui/material';
import { ChannelDisplay } from './ChannelDisplay';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import callAPI from '@/lib/callAPI';

export default function ChannelJoinPrompt() {
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const { addJoinedChannel } = useChannelActions();
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

  async function joinChannel(): Promise<string> {
    if (selectedChannel) {
      const joinedChannel = await callAPI('POST', 'channel-members', {
        channel_id: selectedChannel.id,
        user_id: 1,
        role: ChannelMemberRole.MEMBER,
        pass: channelPass ?? '',
      });

      if (!joinedChannel) {
        return 'Incorrect password';
      }
      addJoinedChannel(selectedChannel.id);
      return '';
    } else {
      return 'FATAL ERROR: FAILED TO JOINED DUE TO MISSING SELECTED CHANNEL';
    }
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
      joinChannel();
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
        const res = await joinChannel();
        if (!res) {
          resetState();
          resetDisplay();
        }
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
          .filter(
            (channel) =>
              !joinedChannels[channel.id] &&
              channel.name
                .toLowerCase()
                .includes(channelSearch.trim().toLowerCase()),
          )
          .map((channel: Channel, index: number) => (
            <ChannelDisplay
              key={index}
              {...channel}
              selected={selectedChannel?.id === channel.id ?? false}
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
