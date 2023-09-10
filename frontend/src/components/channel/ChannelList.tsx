'use client';
import { Button, Stack } from '@mui/material';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';
import ChannelDisplay from './ChannelDisplay';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
  useRecentChannelActivity,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
} from '@/lib/stores/useChannelMemberStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ChannelMemberStatus } from '@/types/ChannelMemberTypes';
import { View } from '@/types/UtilTypes';

export default function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const recentChannelActivity = useRecentChannelActivity();
  const selectedChannel = useSelectedChannel();
  const currentView = useCurrentView();
  const channelSocket = useChannelSocket();
  const { setSelectedChannel, setSelectedChannelMuted, setUnmuteTimeout } =
    useChannelActions();
  const { setSelectedFriend } = useFriendActions();
  const { getChannelMember, changeChannelMemberStatus } =
    useChannelMemberActions();
  const { isChannelOwner, isMemberBanned, isMemberMuted } =
    useChannelMemberChecks();
  const { displayDialog } = useDialogActions();
  const { setCurrentView } = useUtilActions();
  const joinableChannels = channels.filter(
    (channel) =>
      !joinedChannels[channel.id] &&
      !isMemberBanned(currentUser.id, channel.id),
  );

  function handleChannelSelect(channel: Channel): void {
    if (currentView === View.CHAT && selectedChannel?.id === channel.id) {
      setSelectedChannelMuted(channel.id, false);
      setSelectedChannel(undefined);
    } else {
      const currentMember = getChannelMember(currentUser.id, channel.id);

      if (
        channelSocket &&
        currentMember?.status === ChannelMemberStatus.MUTED
      ) {
        if (new Date(currentMember.muted_until).getTime() <= Date.now()) {
          changeChannelMemberStatus(
            currentMember.id,
            ChannelMemberStatus.DEFAULT,
          );
        }
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
      setCurrentView(View.CHAT);
      setSelectedFriend(undefined);
    }
  }

  return (
    <Stack
      direction='column'
      justifyContent='center'
      spacing={1}
      padding='7px'
      overflow='hidden'
    >
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          displayDialog(
            'Create Channel',
            'Choose a name and type to get started',
            <ChannelCreatePrompt />,
            'Create',
          )
        }
      >
        Create Channel
      </Button>
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          displayDialog(
            'Join Channel',
            joinableChannels.length
              ? 'Find and join a channel to start chatting'
              : 'No channels to join... why not create one yourself?',
            <ChannelJoinPrompt joinableChannels={joinableChannels} />,
            'Join',
          )
        }
      >
        Join Channel
      </Button>
      <Stack
        spacing={1}
        sx={{
          overflow: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {channels
          .filter(
            (channel) =>
              joinedChannels[channel.id] &&
              !isMemberBanned(currentUser.id, channel.id) &&
              channel.type !== ChannelType.DIRECT,
          )
          .sort(
            (channelA, channelB) =>
              recentChannelActivity[channelB.id] -
              recentChannelActivity[channelA.id],
          )
          .map((channel, index) => (
            <ChannelDisplay
              key={index}
              channelID={channel.id}
              channelName={channel.name}
              channelType={channel.type}
              channelHash={channel.hash}
              isOwner={isChannelOwner(currentUser.id, channel.id)}
              currentChannelMember={getChannelMember(
                currentUser.id,
                channel.id,
              )}
              selected={selectedChannel?.id === channel.id ?? false}
              selectCurrent={() => handleChannelSelect(channel)}
            />
          ))}
      </Stack>
    </Stack>
  );
}
