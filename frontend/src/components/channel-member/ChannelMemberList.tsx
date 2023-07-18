'use client';

import callAPI from '@/lib/callAPI';
import {
  ChannelMembers,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChannelMemberActionDisplay } from './ChannelMemberActionDisplay';
import { ChannelMemberAddPrompt } from './ChannelMemberAddPrompt';
import ListHeader from '../utils/ListHeader';
import ChannelMemberSettings from './ChannelMemberSettings';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import {
  useChannelActions,
  useChannels,
  useSelectedChannelHash,
  useSelectedChannelID,
} from '@/lib/stores/useChannelStore';

export function ChannelMemberList() {
  const channelMembers = useChannelMembers();
  const {
    getChannelMemberData,
    addChannelMember,
    kickChannelMember,
    changeChannelMemberRole,
    changeChannelMemberStatus,
  } = useChannelMemberActions();
  const { getChannelData } = useChannelActions();
  const channel = useChannels();
  const selectedChannelID = useSelectedChannelID();
  const selectedChannelHash = useSelectedChannelHash();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const { displayConfirmation } = useConfirmationActions();

  useEffect(() => {
    async function getFriends() {
      // probably need to GET all user friend (HARDCODED FOR NOW)
      const friendsData = JSON.parse(
        await callAPI('GET', 'friends?search_type=USER&search_number=1'),
      );
      setFriends(friendsData);
    }
    getFriends();
    getChannelMemberData();

    // getChannelMembers();

    // * My listening sockets * //
    // channelMemberSocket.on('addUser', (data: ChannelMembers) => {
    //   addChannelMember(data);
    // });

    // channelMemberSocket.on('kickUser', (data: ChannelMembers) => {
    //   kickChannelMember(data.id);
    // });

    // channelMemberSocket.on('changeRole', (data: ChannelMembers) => {
    //   changeChannelMemberRole(data.id, data.role);
    // });

    // channelMemberSocket.on('changeStatus', (data: ChannelMembers) => {
    //   changeChannelMemberStatus(data.id, data.status);
    // });
  }, []);

  // * Helper Function for update locals * //

  function updateChannelArray(newChannelName: Channel) {
    setChannels((channelData) => [...channelData, newChannelName]);
  }

  // * Async functions for each actions * //

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
    updateChannelArray(newChannel);
    // channelMemberSocket.emit('changeChannelType', newChannel);
  }

  async function changeChannelName(channelID: number, newName: string) {
    const namePatch = await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName,
    });
    const newChannel: Channel = JSON.parse(namePatch);
    updateChannelArray(newChannel);
    // channelMemberSocket.emit('changeChannelName', newChannel);
  }

  //* ignore the above * //

  async function addUser(userID: number, useHash?: string): Promise<string> {
    const add = await callAPI('POST', 'channel-members', {
      channel_id: selectedChannelID,
      user_id: userID,
      role: ChannelMemberRole.MEMBER,
      hash: useHash,
    });
    const newChannelMember: ChannelMembers = JSON.parse(add);
    console.log('NEWCHANNELMEMBER ADD \n: ', newChannelMember);
    addChannelMember(newChannelMember);
    // channelMemberSocket.emit('addUser', newChannelMember);
    return '';
  }

  async function kickUser(memberID: number): Promise<string> {
    callAPI('DELETE', 'channel-members', { id: memberID });
    kickChannelMember(memberID);
    // channelMemberSocket.emit('kickUser', member);
    return '';
  }

  async function changeToAdmin(memberID: number) {
    callAPI('PATCH', 'channel-members/', {
      id: memberID,
      role: ChannelMemberRole.ADMIN,
    });
    changeChannelMemberRole(memberID, ChannelMemberRole.ADMIN);
    // channelMemberSocket.emit('changeRole', member);
  }

  async function changeToMember(memberID: number) {
    callAPI('PATCH', 'channel-members/', {
      id: memberID,
      role: ChannelMemberRole.MEMBER,
    });
    changeChannelMemberRole(memberID, ChannelMemberRole.MEMBER);
    // channelMemberSocket.emit('changeRole', member);
  }

  async function unmuteMember(memberID: number) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.DEFAULT,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.DEFAULT);
    // channelMemberSocket.emit('changeStatus', member);
  }

  async function muteMember(memberID: number, duration?: Date) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.MUTED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.MUTED);
    // channelMemberSocket.emit('changeStatus', member);
  }

  async function banMember(memberID: number) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.BANNED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.BANNED);
    // channelMemberSocket.emit('changeStatus', member);
  }

  async function changeOwnership(memberID: number) {
    const currentOwner = channelMembers.find((owner) => {
      if (owner.role === ChannelMemberRole.OWNER) {
        return owner.id;
      }
      return undefined;
    });
    if (currentOwner === undefined) {
      console.log('Current owner undefined\n');
      return undefined;
    }
    changeChannelMemberStatus(memberID, ChannelMemberStatus.BANNED);
    callAPI('PATCH', 'channel-members', {
      id: currentOwner.id,
      role: ChannelMemberRole.ADMIN,
    });
    changeChannelMemberRole(currentOwner.id, ChannelMemberRole.ADMIN);
    // channelMemberSocket.emit('changeStatus', currentOwner.id);
  }

  // * Action handlers that are passed into components * //

  async function handleDisplayAction(
    member: ChannelMembers,
    action: ChannelMemberAction,
    duration?: Date,
  ) {
    // * Probably gotta change the testing thingy * //
    switch (action) {
      case ChannelMemberAction.CHOWN:
        return displayConfirmation(
          'Change Ownership to ' + member.user.username + '?',
          'You are transfering the ownership of this server.',
          member.id,
          changeOwnership,
        );
      case ChannelMemberAction.KICK:
        return displayConfirmation(
          'Kick user ' + member.user.username + '?',
          'You are booting the user from the channel.',
          member.id,
          kickUser,
        );
      case ChannelMemberAction.ADMIN:
        return displayConfirmation(
          'Make ' + member.user.username + ' an admin?',
          'You are making this user admin.',
          member.id,
          changeToAdmin,
        );
      case ChannelMemberAction.UNADMIN:
        return displayConfirmation(
          'Remove admin privileges from ' + member.user.username + '?',
          'You are removing admin from this user.',
          member.id,
          changeToMember,
        );
      case ChannelMemberAction.BAN:
        return displayConfirmation(
          'Ban ' + member.user.username + '?',
          'You are banning this user from this channel.',
          member.id,
          banMember,
        );
      case ChannelMemberAction.UNBAN:
        return displayConfirmation(
          'Unban ' + member.user.username + '?',
          'You are unbanning this user from this channel.',
          member.id,
          kickUser,
        );
      case ChannelMemberAction.MUTE:
        return displayConfirmation(
          'Mute ' + member.user.username + '?',
          'You are muting this user from chatting.',
          member.id,
          muteMember,
        );
      case ChannelMemberAction.UNMUTE:
        return displayConfirmation(
          'Unmute ' + member.user.username + '?',
          'You are muting this user from chatting.',
          member.id,
          unmuteMember,
        );
    }
  }

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <ListHeader title='My retarded channel member list'>
        {/* <ChannelMemberSettings
          channelMember={channelMembers}
          selectedchannelID={selectedChannelID}
          handleAction={handleDisplayAction}
          handleNameChange={changeChannelName}
          handleTypeChange={changeChannelType}
        /> */}
      </ListHeader>
      <ChannelMemberAddPrompt
        addUser={addUser}
        friends={friends}
        channelMembers={channelMembers}
        channelHash={selectedChannelHash}
      ></ChannelMemberAddPrompt>
      {channelMembers
        .filter((members) => members.channel.id === selectedChannelID)
        .map((channelMember: ChannelMembers, index: number) => (
          <ChannelMemberActionDisplay
            key={index}
            channelMember={channelMember}
            handleAction={handleDisplayAction}
          />
        ))}
    </Stack>
  );
}
