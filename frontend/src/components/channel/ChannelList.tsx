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
import {
  useChannelMemberActions,
  useChannelMemberChecks,
} from '@/lib/stores/useChannelMemberStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel } = useChannelActions();
  const { isChannelOwner } = useChannelMemberChecks();
  const { getChannelMember } = useChannelMemberActions();

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <ChannelCreatePrompt />
      <ChannelJoinPrompt />
      {channels
        .filter((channel) => joinedChannels[channel.id])
        .map((channel, index) => (
          <ChannelDisplay
            key={index}
            channelID={channel.id}
            channelName={channel.name}
            channelType={channel.type}
            channelHash={channel.hash}
            currentChannelMember={getChannelMember(currentUser.id, channel.id)}
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
