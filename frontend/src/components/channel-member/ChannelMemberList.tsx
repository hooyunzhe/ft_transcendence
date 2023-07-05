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
import ChannelMembers, {
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import { ChannelMemberAddPrompt } from './ChannelMemberAddPrompt';
import ListHeader from '../utils/ListHeader';
import { channelMemberSocket } from '@/lib/socket';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
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

  useEffect(() => {
    async function getFriends() {
      // probably need to GET all user friend (HARDCODED FOR NOW)
      const friendsData = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=1'),
      );
      setFriends(friendsData);
    }
    getFriends();

    async function getChannelMembers() {
      const channelMembersData = JSON.parse(
        await callAPI('GET', 'channel_members'),
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

  function addChannelMember(newChannelMember: ChannelMembers) {
    setChannelMembers((channelMembersData) => [
      ...channelMembersData,
      newChannelMember,
    ]);
  }

  function kickChannelMember(member_id: number) {
    setChannelMembers((channelMembers) => {
      return channelMembers.filter((localMember) => localMember.id !== member_id);
    });
  }

  function changeChannelMemberRole(member_id : number, newRole: ChannelMemberRole){
    setChannelMembers((channelMembers) => {
      return channelMembers.map((localMember) => {
        if (localMember.id === member_id) {
          localMember.role = newRole;
        }
        return localMember;
      });
    });
  }

  function changeChannelMemberStatus(member_id : number, newStatus: ChannelMemberStatus){
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

  async function addUser(userID: number): Promise<string> {
    const add = await callAPI('POST', 'channel_members', {
      channel_id: 1,
      user_id: userID,
      role: 'member',
    });
    const newChannelMember: ChannelMembers = JSON.parse(add);
    addChannelMember(newChannelMember);
    channelMemberSocket.emit('addUser', newChannelMember);
    return '';
  }

  async function kickUser() {
    if (confirmation) {
      const member = confirmation.channelMember;
      callAPI('DELETE', 'channel_members/' + member.id);
      kickChannelMember(member.id);
      channelMemberSocket.emit('kickUser', member);
      setConfirmation(undefined);
    }
  }

  async function changeRole(newRole: ChannelMemberRole) {
    if (confirmation) {
      const member = confirmation.channelMember;
      callAPI('PATCH', 'channel_members/' + member.id, {
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
      callAPI('PATCH', 'channel_members/' + member.id, {
        status: newStatus,
      });
      console.log(member.status);
      changeChannelMemberStatus(member.id, newStatus);
      console.log(member.status);
      channelMemberSocket.emit('changeStatus', member);
      setConfirmation(undefined);
    }
  }

  // * Action handlers that are passed into components * //

  async function handleDisplayAction(
    member: ChannelMembers,
    action: ChannelMemberAction,
    duration?: Date,
  ) {
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
      case ChannelMemberAction.CHOWN: {
        changeRole(ChannelMemberRole.OWNER);
        return;
      }
      case ChannelMemberAction.KICK:
        return kickUser();
      case ChannelMemberAction.ADMIN:
        return changeRole(ChannelMemberRole.ADMIN);
      case ChannelMemberAction.UNADMIN:
        return changeRole(ChannelMemberRole.MEMBER);
      case ChannelMemberAction.BAN:
        return changeStatus(ChannelMemberStatus.BANNED);
      case ChannelMemberAction.UNBAN:
        return changeStatus(ChannelMemberStatus.DEFAULT);
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
      <ListHeader title='My retarded channel member list'></ListHeader>
      <ChannelMemberAddPrompt
        addUser={addUser}
        friends={friends}
        channelMembers={channelMembers}
      ></ChannelMemberAddPrompt>
      {channelMembers.map((channelMember: ChannelMembers, index: number) => (
        <ChannelMemberDisplay
          key={index}
          channelMember={channelMember}
          handleAction={handleDisplayAction}
        />
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
