'use client';

//Modifying channel members
// 1, change roles (owner, admin, member)
// 2. mute and unmute ( maybe for how long see how )
// 3. ban and unban ( same, how long see how ) duration be needed
// 4. remove member from channel.

// steps
// 1. call api
// 2. change local
// 3. emit

import callAPI from '@/lib/callAPI';
import ChannelMembers, {
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMembers';
import { Grid, List } from '@mui/material';
import { Channel } from 'diagnostics_channel';
import { useEffect, useState } from 'react';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';
import ConfirmationPrompt from './ConfirmationPrompt';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);

  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        channelMember: ChannelMembers;
        action: ChannelMemberRole | ChannelMemberStatus;
        duration: Date | undefined;
      }
    | undefined
  >();

  function displayActionText(): string {
    if (!confirmation) {
      return 'display error';
    }
    if (confirmation.action === ChannelMemberRole.ADMIN) {
      return 'You are making this user admin.';
    } else if (confirmation.action === ChannelMemberRole.MEMBER) {
      return 'You are removing admin from this user.';
    } else if (confirmation.action === ChannelMemberStatus.MUTED) {
      return 'You are unmuting this user.';
    } else if (confirmation.action === ChannelMemberStatus.DEFAULT) {
      return 'You are muting this user.';
    } else if (confirmation.action === ChannelMemberStatus.BANNED) {
      return 'You are banning this user.';
    }
    return '';
  }

  async function changeRole(
    member: ChannelMembers,
    newRole: ChannelMemberRole,
  ) {
    callAPI('PATCH', 'channel_members/' + member.id, {
      role: newRole,
    });
    console.log('newRole: ' + newRole);
    setChannelMembers((channelMembers) => {
      return channelMembers.map((localMember) => {
        if (localMember.id === member.id) {
          localMember.role = newRole;
        }
        return localMember;
      });
    });
  }

  async function changeStatus(
    member: ChannelMembers,
    newStatus: ChannelMemberStatus,
    duration?: Date,
  ) {
    console.log(newStatus);
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
  }

  async function handleDisplayAction(
    member: ChannelMembers,
    action: ChannelMemberRole | ChannelMemberStatus,
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

  function handleConfirmationAction() {
    if (!confirmation) {
      return 'FATAL ERROR!!';
    }
    if (confirmation.action in ChannelMemberRole) {
      changeRole(
        confirmation.channelMember,
        confirmation.action as ChannelMemberRole,
      );
    } else if (confirmation.action in ChannelMemberStatus) {
      changeStatus(
        confirmation.channelMember,
        confirmation.action as ChannelMemberStatus,
        confirmation.duration,
      );
    }
    setConfirmation(undefined);
  }

  useEffect(() => {
    async function getChannelMembers() {
      const channelMembersData = JSON.parse(
        await callAPI('GET', 'channel_members'),
      );
      setChannelMembers(channelMembersData);
    }
    getChannelMembers();
  }, []);

  //function to add a user to a channel

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {channelMembers.map((channelMember: ChannelMembers, index: number) => (
          <ChannelMemberDisplay
            key={index}
            channelMember={channelMember}
            handleAction={handleDisplayAction}
          />
        ))}
      </List>
      {confirmation && (
        <ConfirmationPrompt
          open={confirmation.required}
          onCloseHandler={() => {
            setConfirmation(undefined);
          }}
          promptTitle={displayActionText()}
          promptDescription='lalalala'
          handleAction={() => {
            handleConfirmationAction();
          }}
        />
      )}
    </>
  );
}
