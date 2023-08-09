'use client';
import { useEffect, useState } from 'react';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { Stack } from '@mui/material';
import { ChannelDisplay } from './ChannelDisplay';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
} from '@/lib/stores/useChannelStore';
import { ChannelMember, ChannelMemberRole } from '@/types/ChannelMemberTypes';
import callAPI from '@/lib/callAPI';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
} from '@/lib/stores/useChannelMemberStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import PasswordField from '../utils/PasswordField';

export default function ChannelJoinPrompt() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const joinedChannels = useJoinedChannels();
  const { addJoinedChannel } = useChannelActions();
  const { addChannelMember, getChannelMember } = useChannelMemberActions();
  const { isMemberBanned } = useChannelMemberChecks();
  const { displayNotification } = useNotificationActions();
  const channelSocket = useChannelSocket();
  const [channelSearch, setChannelSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();
  const [channelPass, setChannelPass] = useState('');
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();

  function resetDisplay() {
    setDisplayPasswordPrompt(false);
  }

  function resetState() {
    setChannelSearch('');
    setSelectedChannel(undefined);
    setChannelPass('');
  }

  async function joinChannel(): Promise<void> {
    if (selectedChannel) {
      const joiningChannelMember = JSON.parse(
        await callAPI('POST', 'channel-members', {
          channel_id: selectedChannel.id,
          user_id: currentUser.id,
          role: ChannelMemberRole.MEMBER,
          pass: channelPass,
        }),
      );

      if (joiningChannelMember.statusCode === 403) {
        throw 'Incorrect password';
      }

      const existingChannelMembers = JSON.parse(
        await callAPI(
          'GET',
          `channel-members?search_type=CHANNEL&search_number=${selectedChannel.id}`,
        ),
      );
      addJoinedChannel(selectedChannel.id);
      existingChannelMembers.forEach((member: ChannelMember) =>
        addChannelMember(member),
      );
      emitToSocket(channelSocket, 'joinRoom', selectedChannel.id);
      emitToSocket(channelSocket, 'newMember', joiningChannelMember);
      displayNotification('success', 'Channel joined');
    } else {
      throw 'FATAL ERROR: FAILED TO JOINED DUE TO MISSING SELECTED CHANNEL';
    }
  }

  async function handleJoinChannelAction(): Promise<void> {
    const channelToJoin = channels.find(
      (channel) => channel.id === selectedChannel?.id,
    );

    if (!channelToJoin) {
      throw "Channel doesn't exist";
    }

    if (channelToJoin.type === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      joinChannel();
      resetState();
    }
  }

  useEffect(() => {
    if (actionClicked) {
      if (displayPasswordPrompt) {
        joinChannel()
          .then(() => resetDialog())
          .catch((error) => {
            resetTriggers();
            displayNotification('error', error);
          });
      } else {
        handleJoinChannelAction()
          .then(() => {
            if (selectedChannel?.type === ChannelType.PROTECTED) {
              resetTriggers();
            } else {
              resetDialog();
            }
          })
          .catch((error) => {
            resetTriggers();
            displayNotification('error', error);
          });
      }
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return displayPasswordPrompt ? (
    <PasswordField
      value={channelPass}
      onChange={(input) => setChannelPass(input)}
      variant='standard'
    />
  ) : (
    <Stack
      maxHeight={200}
      spacing={1}
      sx={{
        p: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {channels
        .filter(
          (channel) =>
            !joinedChannels[channel.id] &&
            !isMemberBanned(currentUser.id, channel.id) &&
            channel.name
              .toLowerCase()
              .includes(channelSearch.trim().toLowerCase()),
        )
        .map((channel: Channel, index: number) => (
          <ChannelDisplay
            key={index}
            channelID={channel.id}
            channelName={channel.name}
            channelType={channel.type}
            channelHash={channel.hash}
            isOwner={false}
            currentChannelMember={undefined}
            selected={selectedChannel?.id === channel.id ?? false}
            selectCurrent={() => {
              setChannelSearch(channel.name);
              setSelectedChannel(channel);
            }}
          />
        ))}
    </Stack>
  );
}
