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
import { useEffect, useState } from 'react';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);
  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        request: ChannelMembers;
        action: 'banned';
      }
    | undefined
  >();

  async function changeRole(incoming_id: number, newRole: ChannelMemberRole) {
    callAPI('PATCH', 'channel_members/' + incoming_id, {
      role: newRole,
    });
    setChannelMembers((channelMembers) => {
      return channelMembers.map((member) => {
        if (member.id === incoming_id) {
          member.role = newRole;
        }
        return member;
      });
    });
  }

  async function changeStatus(
    incoming_id: number,
    newStatus: ChannelMemberStatus,
    duration?: number,
  ) {
    console.log(newStatus);
    callAPI('PATCH', 'channel_members/' + incoming_id, {
      status: newStatus,
    });
    setChannelMembers((channelMembers) => {
      return channelMembers.map((member) => {
        if (member.id === incoming_id) {
          member.status = newStatus;
        }
        return member;
      });
    });

    function handleAction(request: ChannelMembers) {
      setConfirmation({
        required: true,
        title: 'testing?',
        description: 'testing again',
        request: request,
        action: 'banned',
      });
    }
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
      <Grid>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {channelMembers.map(
            (channelMember: ChannelMembers, index: number) => (
              <ChannelMemberDisplay
                key={index}
                channelMember={channelMember}
                changeRole={changeRole}
                changeStatus={changeStatus}
              ></ChannelMemberDisplay>
            ),
          )}
        </List>
      </Grid>
    </>
  );
}
