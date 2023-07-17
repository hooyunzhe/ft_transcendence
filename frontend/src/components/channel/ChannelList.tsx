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
} from '@/lib/stores/useChannelStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const { getChannelData } = useChannelActions();
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();

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
        .map((channel: Channel, index: number) => (
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
