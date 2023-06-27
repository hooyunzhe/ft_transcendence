'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import ChannelHeader from './ChannelHeader';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();

  function checkChannelExists(name: string): boolean {
    return channels.some((channel) => channel.name === name);
  }

  function checkChannelJoined(name: string): boolean {
    return joinedChannels.some((channel) => channel.name === name);
  }

  async function createChannel(
    channelName: string,
    channelType: ChannelType,
    channelPass?: string,
  ): Promise<string> {
    if (checkChannelExists(channelName)) {
      return 'FATAL ERROR: Channel already exists';
    }
    if (checkChannelJoined(channelName)) {
      return 'FATAL ERROR: Already in channel';
    }

    const newChannel: Channel = JSON.parse(
      await callAPI('POST', 'channels', {
        name: channelName,
        type: channelType,
        hash: channelPass ?? '',
      }),
    );

    if (newChannel) {
      await callAPI('POST', 'channel_members', {
        channel_id: newChannel.id,
        user_id: 1,
        role: ChannelMemberRole.OWNER,
      });

      setJoinedChannels((joinedChannels) => [...joinedChannels, newChannel]);
    } else {
      return 'FATAL ERROR: FAILED TO CREATE NEW CHANNEL IN BACKEND';
    }
    return '';
  }

  async function joinChannel(
    channelID: number,
    channelPass?: string,
  ): Promise<string> {
    const channelToJoin = channels.find((channel) => channel.id === channelID);

    if (!channelToJoin) {
      return "Channel doesn't exist";
    }

    const joinedChannel = await callAPI('POST', 'channel_members', {
      channel_id: channelID,
      user_id: 1,
      role: ChannelMemberRole.MEMBER,
      pass: channelPass ?? '',
    });

    if (!joinedChannel) {
      return 'Incorrect password';
    }
    setJoinedChannels((joinedChannels) => [...joinedChannels, channelToJoin]);
    setChannels((channels) =>
      channels.filter((channel) => channel.id !== channelID),
    );
    return '';
  }

  useEffect(() => {
    async function getChannels(): Promise<void> {
      const channelData = JSON.parse(await callAPI('GET', 'channels'));
      const joinedChannelData = JSON.parse(
        await callAPI('GET', 'users/1/channels'),
      );
      setChannels(
        channelData.filter(
          (channel: Channel) =>
            !joinedChannelData.some(
              (joinedChannel: Channel) => joinedChannel.id === channel.id,
            ) && channel.type !== ChannelType.PRIVATE,
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
      <ChannelHeader />
      <ChannelCreatePrompt
        checkChannelExists={checkChannelExists}
        checkChannelJoined={checkChannelJoined}
        createChannel={createChannel}
      />
      <ChannelJoinPrompt channels={channels} joinChannel={joinChannel} />
      {joinedChannels.map((channel: Channel, index: number) => (
        <ChannelDisplay
          key={index}
          {...channel}
          selected={selectedChannel?.id ?? 0}
          selectCurrent={() => {
            setSelectedChannel(channel);
          }}
        />
      ))}
    </Stack>
  );
}
