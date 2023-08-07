'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Button, Stack } from '@mui/material';
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
import { useFriendActions } from '@/lib/stores/useFriendStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';
import { ChannelType } from '@/types/ChannelTypes';
import { useDialogActions } from '@/lib/stores/useDialogStore';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const recentChannelActivity = useRecentChannelActivity();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel } = useChannelActions();
  const { setSelectedFriend } = useFriendActions();
  const { isChannelOwner } = useChannelMemberChecks();
  const { getChannelMember } = useChannelMemberActions();
  const { setCurrentView } = useUtilActions();
  const { displayDialog } = useDialogActions();

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <Button
        onClick={() =>
          displayDialog(
            'Channel Creation',
            'Add channels here',
            <ChannelCreatePrompt />,
            'Next',
          )
        }
      >
        Create Channel
      </Button>
      <Button
        onClick={() =>
          displayDialog(
            'Channel Join',
            'Join channel here',
            <ChannelJoinPrompt />,
            'Join',
          )
        }
      >
        Join Channel
      </Button>
      {channels
        .filter(
          (channel) =>
            joinedChannels[channel.id] && channel.type !== ChannelType.DIRECT,
        )
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
                setSelectedFriend(undefined);
              }
            }}
          />
        ))}
    </Stack>
  );
}
