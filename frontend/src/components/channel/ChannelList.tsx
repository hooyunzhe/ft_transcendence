'use client';
import { ChannelDisplay } from './ChannelDisplay';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import ChannelHeader from './ChannelHeader';
import DialogPrompt from '../utils/DialogPrompt';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState<ChannelType>(
    ChannelType.PUBLIC,
  );
  const [channelName, setChannelName] = useState('');
  const [channelPass, setChannelPass] = useState('');
  const [channelID, setChannelID] = useState(0);
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);

  function findChannelWithName(name: string) {
    return channels.find((channel) => channel.name === name);
  }

  async function createChannel(): Promise<string> {
    const foundChannel = findChannelWithName(channelName);

    if (foundChannel) {
      return 'FATAL ERROR: Channel already exists';
    }

    const newChannel: Channel = JSON.parse(
      await callAPI('POST', 'channels', {
        name: channelName,
        type: channelType,
      }),
    );

    if (newChannel) {
      await joinChannel();

      await callAPI('PATCH', 'channel_members/' + newChannel.id, {
        role: ChannelMemberRole.OWNER,
      });

      setChannels([...channels, newChannel]);
    } else {
      return 'FATAL ERROR: FAILED TO CREATE NEW CHANNEL IN BACKEND';
    }
    setChannelType(ChannelType.PUBLIC);
    setChannelName('');
    setChannelPass('');
    return '';
  }

  async function joinChannel() {
    await callAPI('POST', 'channel_members', {
      channel_id: channelID,
      user_id: 1,
    });
    setChannelID(0);
  }

  async function handlePromptAction(): Promise<string> {
    const foundChannel = findChannelWithName(channelName);
    if (foundChannel) {
      return 'Channel already exists';
    }
    if (channelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      createChannel();
    }
    return '';
  }

  useEffect(() => {
    async function getChannels() {
      const channelData = JSON.parse(await callAPI('GET', 'channels'));
      const joinedChannelData = JSON.parse(
        await callAPI('GET', 'users/1/channels'),
      );
      setChannels(
        channelData.filter(
          (channel: Channel) => !joinedChannelData.includes(channel),
        ),
      );
      setJoinedChannels(joinedChannelData);
    }
    getChannels();
  }, []);

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <ChannelHeader></ChannelHeader>
      {displayPasswordPrompt ? (
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
          backHandler={() => {
            setDisplayPasswordPrompt(false);
          }}
          actionButtonText='Create'
          handleAction={async () => {
            setDisplayPasswordPrompt(false);
            return createChannel();
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
          backHandler={() => {
            setDisplayPasswordPrompt(false);
          }}
          handleAction={handlePromptAction}
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
      )}
      <DialogPrompt
        buttonText='Join channel'
        dialogTitle='Search channels'
        dialogDescription='Find a channel to join'
        labelText='Channel name'
        textInput={channelName}
        onChangeHandler={(input) => {
          setChannelName(input);
        }}
        backButtonText='Cancel'
        backHandler={() => {}}
        actionButtonText='Join'
        handleAction={async () => {
          console.log('handles action');
          return 'handles action';
        }}
      >
        {channels.map((channel: Channel, index: number) => (
          <ChannelDisplay key={index} {...channel} />
        ))}
      </DialogPrompt>
      {joinedChannels.map((channel: Channel, index: number) => (
        <ChannelDisplay key={index} {...channel} />
      ))}
    </Stack>
  );
}
