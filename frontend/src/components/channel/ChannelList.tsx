'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Stack } from '@mui/material';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChannelMemberChecks } from '@/lib/stores/useChannelMemberStore';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel } = useChannelActions();
  const { isChannelOwner } = useChannelMemberChecks();

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <ChannelCreatePrompt />
      <ChannelJoinPrompt />
      {channels
        .filter((channel) => joinedChannels[channel.id])
        .map((channel, index) => (
          <ChannelDisplay
            key={index}
            {...channel}
            selected={selectedChannel?.id === channel.id ?? false}
            selectCurrent={() => {
              selectedChannel?.id === channel.id
                ? setSelectedChannel(undefined)
                : setSelectedChannel(channel);
            }}
            isOwner={isChannelOwner(currentUser.id, channel.id)}
          />
        ))}
    </Stack>
  );
}
