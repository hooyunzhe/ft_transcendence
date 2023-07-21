'use client';
import { ChannelDisplay } from './ChannelDisplay';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import ChannelCreatePrompt from './ChannelCreatePrompt';
import ChannelJoinPrompt from './ChannelJoinPrompt';
import {
  useChannelActions,
  useChannels,
  useJoinedChannels,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import ListHeader from '../utils/ListHeader';
import ChannelSettings from './ChannelSettings';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import callAPI from '@/lib/callAPI';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { ChannelMembers } from '@/types/ChannelMemberTypes';

export function ChannelList() {
  const currentUser = useCurrentUser();
  const channels = useChannels();
  const { kickChannelMember } = useChannelMemberActions();
  const channelMembers = useChannelMembers();
  const joinedChannels = useJoinedChannels();
  const { getChannelData } = useChannelActions();
  const selectedChannel = useSelectedChannel();
  const { setSelectedChannel } = useChannelActions();
  const { displayConfirmation } = useConfirmationActions();

  useEffect(() => {
    getChannelData(currentUser.id);
  }, []);

  async function changeChannelType(
    channelID: number,
    newType: ChannelType,
    newPass?: string,
  ) {
    const typePatch = await callAPI('PATCH', 'channels', {
      id: channelID,
      type: newType,
      pass: newPass,
    });
    const newChannel: Channel = JSON.parse(typePatch);
    changeChannelType(newChannel.id, newType, newPass);
    // channelMemberSocket.emit('changeChannelType', newChannel);
  }

  async function changeChannelName(channelID: number, newName: string) {
    const namePatch = await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName,
    });
    const newChannel: Channel = JSON.parse(namePatch);
    changeChannelName(newChannel.id, newName);
    // channelMemberSocket.emit('changeChannelName', newChannel);
  }

  async function kickUser(memberID: number): Promise<string> {
    callAPI('DELETE', 'channel-members', { id: memberID });
    kickChannelMember(memberID);
    return '';
  }

  async function unbanChannelUser(member: ChannelMembers) {
    return displayConfirmation(
      'Unban ' + member.user.username + '?',
      'You are unbanning this user from this channel.',
      member.id,
      kickUser,
    );
  }

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      {selectedChannel ? (
        <ListHeader title={selectedChannel.name}>
          <ChannelSettings
            channelMember={channelMembers}
            channel={selectedChannel}
            selectedchannelID={selectedChannel.id}
            handleAction={unbanChannelUser}
            handleNameChange={changeChannelName}
            handleTypeChange={changeChannelType}
          />
        </ListHeader>
      ) : null}
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
          />
        ))}
    </Stack>
  );
}
