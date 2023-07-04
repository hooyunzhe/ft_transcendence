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
    async function getChannelMembers() {
      const channelMembersData = JSON.parse(
        await callAPI('GET', 'channel_members'),
      );
      // console.log('channelMemberData: ', channelMembersData);
      setChannelMembers(channelMembersData);

    }
    getChannelMembers();

    async function getFriends() {
      // probably need to GET all user friend (HARDCODED FOR NOW)
      const friendsData = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=1'),
      );
      // console.log('friendsData: ', friendsData);
      setFriends(friendsData);
    }
    getFriends();

    // my socket shit are here
    channelMemberSocket.on('addUser', (data: ChannelMembers) => {
      console.log('ADD USER IN LOCAL CALLED');
      AddUser(data.user.id);
    });
  }, []);


  function kickMember(member: ChannelMembers) {
    setChannelMembers((channelMembers) => {
      return channelMembers.filter(
        (localMember) => localMember.id !== member.id,
      );
    });
  }

  function changeMemberRole(member: ChannelMembers, newRole: ChannelMemberRole) {
    setChannelMembers((channelMembers) => {
      return channelMembers.map((localMember) => {
        if (localMember.id === member.id) {
          localMember.role = newRole;
        }
        return localMember;
      });
    });
  }

  function addMember(member: ChannelMembers) {
    setChannelMembers((channelMembers) => {
      return [...channelMembers, member];
    });
  }

  async function kickUser() {
    if (confirmation) {
      const member = confirmation.channelMember;

      callAPI('DELETE', 'channel_members/' + member.id);
      kickMember(member);
      setConfirmation(undefined);
    }
  }

  async function changeRole(newRole: ChannelMemberRole) {
    if (confirmation) {
      const member = confirmation.channelMember;
      callAPI('PATCH', 'channel_members/' + member.id, {
        role: newRole,
      });
      // console.log('newRole: ' + newRole);
      changeMemberRole(member, newRole);
      setConfirmation(undefined);
    }
  }

  async function changeStatus(newStatus: ChannelMemberStatus, duration?: Date) {
    if (confirmation) {
      const member = confirmation.channelMember;
      // console.log(newStatus);
      callAPI('PATCH', 'channel_members/' + member.id, {
        status: newStatus,
      });
      setChannelMembers((channelMembers) => {
        return channelMembers.map((localMember) => {
          if (localMember.id === member.id) {
            localMember.status = newStatus;
          }
          return localMember;
        });
      });
      setConfirmation(undefined);
    }
  }

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

  async function AddUser(user_ID: number): Promise<string> {
    console.log('Add User Function');

    const derp = await callAPI('POST', 'channel_members', {
      channel_id: 1,
      user_id: user_ID,
    });
    const newChannelMember: ChannelMembers = JSON.parse(derp);
    addMember(newChannelMember);
    channelMemberSocket.emit('addUser', newChannelMember);
    return '';
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
      <ListHeader title='My retarded channel list'></ListHeader>
      <ChannelMemberAddPrompt
        AddUser={AddUser}
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
