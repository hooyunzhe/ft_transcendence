'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Stack } from '@mui/material';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
  useRecentChannelActivity,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
} from '@/lib/stores/useChannelMemberStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const recentChannelActivity = useRecentChannelActivity();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel } = useChannelActions();
  const { isChannelOwner } = useChannelMemberChecks();
  const { getChannelMember } = useChannelMemberActions();
  const { setCurrentView } = useUtilActions();

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <ChannelCreatePrompt />
      <ChannelJoinPrompt />
      {channels
        .filter((channel) => joinedChannels[channel.id])
        .sort((channelA, channelB) => {
          return (
            recentChannelActivity[channelB.id] -
            recentChannelActivity[channelA.id]
          );
        })
        .map((channel, index) => (
          <ChannelDisplay
            key={index}
            channelID={channel.id}
            channelName={channel.name}
            channelType={channel.type}
            channelHash={channel.hash}
            isOwner={isChannelOwner(currentUser.id, channel.id)}
            currentChannelMember={getChannelMember(currentUser.id, channel.id)}
            selected={selectedChannel?.id === channel.id ?? false}
            selectCurrent={() => {
              if (selectedChannel?.id === channel.id) {
                setSelectedChannel(undefined);
              } else {
                setSelectedChannel(channel);
                if (selectedChannel === undefined) {
                  setCurrentView(View.CHAT);
                }
              }
            }}
          />
        ))}
    </Stack>
  );
}
