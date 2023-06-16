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
import ConfirmationPrompt from './ConfirmationPrompt';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);

  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        request: ChannelMembers | undefined;
        action: ChannelMemberRole | ChannelMemberStatus;
      }
    | undefined
  >();

  async function changeRole(
    member: ChannelMembers,
    newRole: ChannelMemberRole,
  ) {
    callAPI('PATCH', 'channel_members/' + member.id, {
      role: newRole,
    });
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

  async function actionHandler(
    request: ChannelMembers,
    action: ChannelMemberRole | ChannelMemberStatus,
    duration?: Date,
  ) {
    if (action in ChannelMemberRole) {
      changeRole(request, action as ChannelMemberRole);
    } else if (action in ChannelMemberStatus) {
      changeStatus(request, action as ChannelMemberStatus, duration);
    }

    setConfirmation({
      required: true,
      title: 'testing?',
      description: 'testing again',
      request: undefined,
      action: action,
    });
  }

  async function promptHandler(bool: boolean): Promise<any> {
    console.log('promptHandler');
    return (
      <ConfirmationPrompt
        open={bool}
        onCloseHandler={() => {
          setConfirmation(undefined);
        }}
        promptTitle='Yipee you opened it'
        promptDescription='Blah blah blah'
        actionHandler={() => {
          // handleRequest(confirmation.request, confirmation.action);
          setConfirmation(undefined);
        }}
      ></ConfirmationPrompt>
    );
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
              <>
                <ChannelMemberDisplay
                  key={index}
                  channelMember={channelMember}
                  handleAction={actionHandler}
                  promptHandler={promptHandler}
                ></ChannelMemberDisplay>
                {confirmation && (
                  <ConfirmationPrompt
                    open={confirmation.required}
                    onCloseHandler={() => {
                      setConfirmation(undefined);
                    }}
                    promptTitle='Yipee you opened it (hardcoded bullshit)'
                    promptDescription='Blah blah blah'
                    actionHandler={() => {
                      setConfirmation(undefined);
                      // handleRequest(confirmation.request, confirmation.action);
                    }}
                  ></ConfirmationPrompt>
                )}
              </>
            ),
          )}
        </List>
      </Grid>
    </>
  );
}
