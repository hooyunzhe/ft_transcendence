'use client';
import { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import DialogPrompt from '../utils/DialogPrompt';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import callAPI from '@/lib/callAPI';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import {
  useChannelActions,
  useChannelChecks,
} from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';

export default function ChannelCreatePrompt() {
  const { addChannel, addJoinedChannel } = useChannelActions();
  const { checkChannelExists, checkChannelJoined } = useChannelChecks();
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>(
    ChannelType.PUBLIC,
  );
  const [channelPass, setChannelPass] = useState('');
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const { addChannelMember } = useChannelMemberActions();

  function resetDisplay() {
    setDisplayPasswordPrompt(false);
  }

  function resetState() {
    setChannelName('');
    setChannelType(ChannelType.PUBLIC);
    setChannelPass('');
  }

  async function createChannel(): Promise<string> {
    const newChannel: Channel = JSON.parse(
      await callAPI('POST', 'channels', {
        name: channelName,
        type: channelType,
        pass: channelPass ?? '',
      }),
    );

    if (newChannel) {
      addChannel(newChannel);

      const channelCreator = JSON.parse(
        await callAPI('POST', 'channel-members', {
          channel_id: newChannel.id,
          user_id: 1,
          role: ChannelMemberRole.OWNER,
        }),
      );

      if (channelCreator) {
        addJoinedChannel(newChannel.id);
        addChannelMember(channelCreator);
        return '';
      } else {
        return 'FATAL ERROR: FAILED TO ADD MEMBER TO NEW CHANNEL IN BACKEND';
      }
    } else {
      return 'FATAL ERROR: FAILED TO CREATE NEW CHANNEL IN BACKEND';
    }
  }

  async function handleCreateChannelAction(): Promise<string> {
    if (checkChannelExists(channelName)) {
      return 'Channel already exists';
    }
    if (checkChannelJoined(channelName)) {
      return 'Already in channel';
    }
    if (channelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      createChannel();
      resetState();
    }
    return '';
  }

  return displayPasswordPrompt ? (
    <DialogPrompt
      buttonText='Create channel'
      dialogTitle='Set channel password'
      dialogDescription='Enter the channel password of your desire'
      labelText='Password'
      textInput={channelPass}
      onChangeHandler={(input) => {
        setChannelPass(input);
      }}
      backButtonText='Back'
      backHandler={resetDisplay}
      actionButtonText='Create'
      handleAction={async () => {
        const res = createChannel();
        resetState();
        resetDisplay();
        return res;
      }}
    />
  ) : (
    <DialogPrompt
      buttonText='Create channel'
      dialogTitle='Channel creation'
      dialogDescription='Create your channel here'
      labelText='Name'
      textInput={channelName}
      onChangeHandler={(input) => {
        setChannelName(input);
      }}
      actionButtonText={
        channelType === ChannelType.PROTECTED ? 'Next' : 'Create'
      }
      backButtonText='Cancel'
      backHandler={resetDisplay}
      handleAction={handleCreateChannelAction}
    >
      <FormControl>
        <FormLabel>Type</FormLabel>
        <RadioGroup
          row
          value={channelType}
          onChange={(event) => {
            setChannelType(event.target.value as ChannelType);
          }}
        >
          <FormControlLabel
            value={ChannelType.PUBLIC}
            control={<Radio />}
            label='Public'
          />
          <FormControlLabel
            value={ChannelType.PRIVATE}
            control={<Radio />}
            label='Private'
          />
          <FormControlLabel
            value={ChannelType.PROTECTED}
            control={<Radio />}
            label='Protected'
          />
        </RadioGroup>
      </FormControl>
    </DialogPrompt>
  );
}
