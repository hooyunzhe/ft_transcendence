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
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { ChannelMemberStatus } from '@/types/ChannelMemberTypes';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const recentChannelActivity = useRecentChannelActivity();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel, setSelectedChannelMuted, setUnmuteTimeout } =
    useChannelActions();
  const { setSelectedFriend } = useFriendActions();
  const { isChannelOwner, isMemberBanned, isMemberMuted } =
    useChannelMemberChecks();
  const { getChannelMember } = useChannelMemberActions();
  const { setCurrentView } = useUtilActions();
  const { displayDialog } = useDialogActions();
  const channelSocket = useChannelSocket();

  function handleChannelSelect(channel: Channel): void {
    if (selectedChannel?.id === channel.id) {
      setSelectedChannelMuted(channel.id, false);
      setSelectedChannel(undefined);
    } else {
      const currentMember = getChannelMember(currentUser.id, channel.id);
      if (
        channelSocket &&
        currentMember?.status === ChannelMemberStatus.MUTED
      ) {
        setUnmuteTimeout(
          currentMember.muted_until,
          currentMember.id,
          currentUser.id,
          channel.id,
          channelSocket,
        );
      }
      setSelectedChannel(channel);

      setSelectedChannelMuted(
        channel.id,
        isMemberMuted(currentUser.id, channel.id),
      );
      if (selectedChannel === undefined) {
        setCurrentView(View.CHAT);
      }
      setSelectedFriend(undefined);
    }
  }

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <Button
        variant='contained'
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
        variant='contained'
        onClick={() =>
          displayDialog(
            'Channel Join',
            'Join channels here',
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
            joinedChannels[channel.id] &&
            !isMemberBanned(currentUser.id, channel.id) &&
            channel.type !== ChannelType.DIRECT,
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
            selectCurrent={() => handleChannelSelect(channel)}
          />
        ))}
    </Stack>
  );
}
