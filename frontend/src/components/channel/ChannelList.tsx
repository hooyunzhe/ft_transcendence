'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Channel } from '@/types/ChannelTypes';
import ChannelHeader from './ChannelHeader';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
  useSelectedChannelID,
} from '@/lib/stores/useChannelStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const { getChannelData } = useChannelActions();
  const selectedChannelID = useSelectedChannelID();
  const { setSelectedChannelID, setSelectedChannelHash } = useChannelActions();

  useEffect(() => {
    getChannelData(currentUser.id);
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
      <ChannelCreatePrompt />
      <ChannelJoinPrompt />
      {channels
        .filter((channel) => joinedChannels[channel.id])
        .map((channel, index) => (
          <ChannelDisplay
            key={index}
            {...channel}
            selected={selectedChannelID}
            selectCurrent={() => {
              setSelectedChannelID(
                selectedChannelID === channel.id ? 0 : channel.id,
              );
              setSelectedChannelHash(channel.hash);
            }}
          />
        ))}
    </Stack>
  );
}
