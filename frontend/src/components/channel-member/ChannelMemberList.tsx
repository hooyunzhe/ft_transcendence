//Modifying channel members
// 1, change roles (owner, admin, member)
// 2. mute and unmute ( maybe for how long see how )
// 3. ban and unban ( same, how long see how ) duration be needed
// 4. remove member from channel.

// steps
// 1. call api
// 2. change local
// 3. emit

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
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import { ChannelMemberAddPrompt } from './ChannelMemberAddPrompt';
import ListHeader from '../utils/ListHeader';
import { channelMemberSocket } from '@/lib/socket';
import ChannelMemberSettings from './ChannelMemberSettings';
import { Channel, ChannelType } from '@/types/ChannelTypes';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        channelMember: ChannelMembers;
        action: ChannelMemberAction;
        duration: Date | undefined;
      }
    | undefined
  >();

  const tempBanned = ChannelMemberStatus.BANNED;
  const tempChannel: Channel = {
    id: 1,
    name: 'your_name',
    type: ChannelType.PUBLIC,
    pass: '',
    hash: '',
  };

  useEffect(() => {
    async function getFriends() {
      // probably need to GET all user friend (HARDCODED FOR NOW)
      const friendsData = JSON.parse(
        await callAPI('GET', 'friends?search_type=USER&search_number=1'),
      );
      setFriends(friendsData);
    }
    getFriends();

    async function getChannelMembers() {
      const channelMembersData = JSON.parse(
        await callAPI('GET', 'channel-members?search_type=ALL'),
      );
      setChannelMembers(channelMembersData);
    }
    getChannelMembers();

    // * My listening sockets * //
    channelMemberSocket.on('addUser', (data: ChannelMembers) => {
      addChannelMember(data);
    });

    channelMemberSocket.on('kickUser', (data: ChannelMembers) => {
      kickChannelMember(data.id);
    });

    channelMemberSocket.on('changeRole', (data: ChannelMembers) => {
      changeChannelMemberRole(data.id, data.role);
    });

    channelMemberSocket.on('changeStatus', (data: ChannelMembers) => {
      changeChannelMemberStatus(data.id, data.status);
    });
  }, []);

  // * Helper Function for update locals * //

  function updateChannelArray(newChannelName: Channel) {
    setChannels((channelData) => [...channelData, newChannelName]);
  }

  function addChannelMember(newChannelMember: ChannelMembers) {
    setChannelMembers((channelMembersData) => [
      ...channelMembersData,
      newChannelMember,
    ]);
  }

  function kickChannelMember(member_id: number) {
    setChannelMembers((channelMembers) => {
      return channelMembers.filter(
        (localMember) => localMember.id !== member_id,
      );
    });
  }

  function changeChannelMemberRole(
    member_id: number,
    newRole: ChannelMemberRole,
  ) {
    setChannelMembers((channelMembers) => {
      return channelMembers.map((localMember) => {
        if (localMember.id === member_id) {
          localMember.role = newRole;
        }
        return localMember;
      });
    });
  }

  function changeChannelMemberStatus(
    member_id: number,
    newStatus: ChannelMemberStatus,
  ) {
    setChannelMembers((channelMembers) => {
      return channelMembers.map((localMember) => {
        if (localMember.id === member_id) {
          localMember.status = newStatus;
        }
        return localMember;
      });
    });
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
    channelMemberSocket.emit('changeChannelType', newChannel);
  }

  async function changeChannelName(channelID: number, newName: string) {
    const namePatch = await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName,
    });
    const newChannel: Channel = JSON.parse(namePatch);
    updateChannelArray(newChannel);
    channelMemberSocket.emit('changeChannelName', newChannel);
  }

  async function addUser(userID: number): Promise<string> {
    const add = await callAPI('POST', 'channel-members', {
      channel_id: 1,
      user_id: userID,
      role: ChannelMemberRole.MEMBER,
    });
    const newChannelMember: ChannelMembers = JSON.parse(add);
    addChannelMember(newChannelMember);
    channelMemberSocket.emit('addUser', newChannelMember);
    return '';
  }

  async function kickUser(): Promise<string> {
    if (confirmation) {
      const member = confirmation.channelMember;
      console.log(member.id);
      callAPI('DELETE', 'channel-members', { id: member.id });
      kickChannelMember(member.id);
      channelMemberSocket.emit('kickUser', member);
      setConfirmation(undefined);
    }
    return '';
  }

  async function changeRole(newRole: ChannelMemberRole) {
    if (confirmation) {
      const member = confirmation.channelMember;
      callAPI('PATCH', 'channel-members/', {
        id: member.id,
        role: newRole,
      });
      changeChannelMemberRole(member.id, newRole);
      channelMemberSocket.emit('changeRole', member);
      setConfirmation(undefined);
    }
  }

  async function changeStatus(newStatus: ChannelMemberStatus, duration?: Date) {
    if (confirmation) {
      const member = confirmation.channelMember;
      callAPI('PATCH', 'channel-members', {
        id: member.id,
        status: newStatus,
        muted_until: new Date().toISOString(),
      });
      changeChannelMemberStatus(member.id, newStatus);
      channelMemberSocket.emit('changeStatus', member);
      setConfirmation(undefined);
    }
  }

  async function changeOwnership(newRole: ChannelMemberRole) {
    if (confirmation) {
      console.log('---CHANGE OWNERSHIP---\n');
      const member = confirmation.channelMember;

      const currentOwner = await channelMembers.find((owner) => {
        if (owner.role === ChannelMemberRole.OWNER) {
          return owner.id;
        }
        return undefined;
      });
      if (currentOwner === undefined) {
        console.log('Current owner undefined\n');
        return undefined;
      }
      changeRole(ChannelMemberRole.OWNER);
      callAPI('PATCH', 'channel-members', {
        id: currentOwner.id,
        role: ChannelMemberRole.ADMIN,
      });
      changeChannelMemberRole(currentOwner.id, ChannelMemberRole.ADMIN);
      channelMemberSocket.emit('changeStatus', currentOwner.id);
    }
  }

  // * Action handlers that are passed into components * //

  async function handleDisplayAction(
    member: ChannelMembers,
    action: ChannelMemberAction,
    duration?: Date,
  ) {
    // * Probably gotta change the testing thingy * //
    setConfirmation({
      required: true,
      title: 'testing?',
      description: 'testing again',
      channelMember: member,
      action: action,
      duration: duration,
    });
  }

  function handleConfirmationAction(action: ChannelMemberAction) {
    if (!confirmation) {
      return 'handleConfirmationAction error!!';
    }
    switch (action) {
      case ChannelMemberAction.CHOWN:
        return changeOwnership(ChannelMemberRole.OWNER);
      case ChannelMemberAction.KICK:
        return kickUser();
      case ChannelMemberAction.ADMIN:
        return changeRole(ChannelMemberRole.ADMIN);
      case ChannelMemberAction.UNADMIN:
        return changeRole(ChannelMemberRole.MEMBER);
      case ChannelMemberAction.BAN:
        return changeStatus(ChannelMemberStatus.BANNED);
      case ChannelMemberAction.UNBAN:
        return kickUser();
      case ChannelMemberAction.MUTE:
        return changeStatus(ChannelMemberStatus.MUTED);
      case ChannelMemberAction.UNMUTE:
        return changeStatus(ChannelMemberStatus.DEFAULT);
    }
  }

  function displayActionText(): string {
    if (!confirmation) {
      return 'displayActionText error';
    }
    if (confirmation.action === ChannelMemberAction.ADMIN) {
      return 'You are making this user admin.';
    } else if (confirmation.action === ChannelMemberAction.UNADMIN) {
      return 'You are removing admin from this user.';
    } else if (confirmation.action === ChannelMemberAction.UNMUTE) {
      return 'You are unmuting this user.';
    } else if (confirmation.action === ChannelMemberAction.MUTE) {
      return 'You are muting this user.';
    } else if (confirmation.action === ChannelMemberAction.BAN) {
      return 'You are banning this user.';
    } else if (confirmation.action === ChannelMemberAction.UNBAN) {
      return 'You are unbanning this user.';
    } else if (confirmation.action === ChannelMemberAction.CHOWN) {
      return 'You are transfering the ownership of this server.';
    } else if (confirmation.action === ChannelMemberAction.KICK) {
      return 'You are booting the user from the channel.';
    }
    return '';
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
        <ChannelMemberSettings
          channelMember={channelMembers}
          channel={tempChannel}
          handleAction={handleDisplayAction}
          handleNameChange={changeChannelName}
          handleTypeChange={changeChannelType}
        />
      </ListHeader>
      <ChannelMemberAddPrompt
        addUser={addUser}
        friends={friends}
        channelMembers={channelMembers}
      ></ChannelMemberAddPrompt>
      {channelMembers.map((channelMember: ChannelMembers, index: number) => (
        <>
          <ChannelMemberActionDisplay
            key={index}
            channelMember={channelMember}
            handleAction={handleDisplayAction}
          />
        </>
      ))}
      {confirmation && (
        <ConfirmationPrompt
          open={confirmation.required}
          onCloseHandler={() => {
            setConfirmation(undefined);
          }}
          promptTitle={displayActionText()}
          promptDescription='Are you bloody sure?'
          handleAction={() => {
            handleConfirmationAction(confirmation.action);
          }}
        />
      )}
    </Stack>
  );
}
