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
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import {
  useChannelMemberActions,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useChannelMemberSocket } from '@/lib/stores/useSocketStore';

export function ChannelMemberList() {
  const channelMembers = useChannelMembers();
  const {
    getChannelMemberData,
    addChannelMember,
    kickChannelMember,
    changeChannelMemberRole,
    changeChannelMemberStatus,
  } = useChannelMemberActions();
  const channelMemberSocket = useChannelMemberSocket();
  const selectedChannel = useSelectedChannel();
  const [friends, setFriends] = useState<Friend[]>([]);
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
  }, []);

  // * Helper Function for update locals * //

  //* ignore the above * //

  async function addUser(userID: number, useHash?: string): Promise<string> {
    const add = await callAPI('POST', 'channel-members', {
      channel_id: selectedChannel?.id,
      user_id: userID,
      role: ChannelMemberRole.MEMBER,
      hash: useHash,
    });
    const newChannelMember: ChannelMembers = JSON.parse(add);
    console.log('NEWCHANNELMEMBER ADD \n: ', newChannelMember);
    addChannelMember(newChannelMember);
    channelMemberSocket.emit('addUser', newChannelMember);
    return '';
  }

  async function kickUser(memberID: number): Promise<string> {
    callAPI('DELETE', 'channel-members', { id: memberID });
    kickChannelMember(memberID);
    channelMemberSocket.emit('kickUser', memberID);
    return '';
  }

  async function changeToAdmin(memberID: number) {
    callAPI('PATCH', 'channel-members/', {
      id: memberID,
      role: ChannelMemberRole.ADMIN,
    });
    changeChannelMemberRole(memberID, ChannelMemberRole.ADMIN);
    channelMemberSocket.emit('changeRole', memberID);
  }

  async function changeToMember(memberID: number) {
    callAPI('PATCH', 'channel-members/', {
      id: memberID,
      role: ChannelMemberRole.MEMBER,
    });
    changeChannelMemberRole(memberID, ChannelMemberRole.MEMBER);
    channelMemberSocket.emit('changeRole', memberID);
  }

  async function unmuteMember(memberID: number) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.DEFAULT,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.DEFAULT);
    channelMemberSocket.emit('changeStatus', memberID);
  }

  async function muteMember(memberID: number, duration?: Date) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.MUTED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.MUTED);
    channelMemberSocket.emit('changeStatus', memberID);
  }

  async function banMember(memberID: number) {
    callAPI('PATCH', 'channel-members', {
      id: memberID,
      status: ChannelMemberStatus.BANNED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(memberID, ChannelMemberStatus.BANNED);
    channelMemberSocket.emit('changeStatus', memberID);
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
    channelMemberSocket.emit('changeStatus', currentOwner.id);
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

  return selectedChannel ? (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <ListHeader title='My retarded channel member list'></ListHeader>
      <ChannelMemberAddPrompt
        addUser={addUser}
        friends={friends}
        channelMembers={channelMembers}
        channelHash={selectedChannel.hash}
      ></ChannelMemberAddPrompt>
      {channelMembers
        .filter((members) => members.channel.id === selectedChannel.id)
        .map((channelMember: ChannelMembers, index: number) => (
          <ChannelMemberActionDisplay
            key={index}
            channelMember={channelMember}
            handleAction={handleDisplayAction}
          />
        ))}
    </Stack>
  ) : null;
}
