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
import { channelMemberSocket } from '@/lib/ChannelMemberSocket';
import ChannelMembers, {
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import ChannelHeader from './ChannelHeader';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';
import ConfirmationPrompt from './ConfirmationPrompt';
import DialogPrompt from './DialogPrompt';
import FriendDisplay from './FriendDisplay';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>();
  const [friendSearch, setFriendSearch] = useState('');
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
      setChannelMembers(channelMembersData);

      channelMemberSocket.emit('test', (data: ChannelMembers) => {});
    }
    getChannelMembers();

    async function getFriends() {
      // probably need to GET all user friend (HARDCODED FOR NOW)
      const friendsData = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=1'),
      );
      setFriends(friendsData);
    }
    getFriends();

    // my socket shit are here
    channelMemberSocket.on('test', (data: ChannelMembers) => {
      console.log('--Signal-- received from server!');
      console.log('channel id: ' + data.id);
      console.log(`You are connected with id ${channelMemberSocket.id}`);
      setChannelMembers((channelMembersData) => [...channelMembersData, data]);
    });
  }, []);

  async function kickUser() {
    if (confirmation) {
      const member = confirmation.channelMember;

      callAPI('DELETE', 'channel_members/' + member.id);
      setChannelMembers((channelMembers) => {
        return channelMembers.filter(
          (localMember) => localMember.id !== member.id,
        );
      });
      setConfirmation(undefined);
    }
  }

  async function changeRole(newRole: ChannelMemberRole) {
    if (confirmation) {
      const member = confirmation.channelMember;
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
      setConfirmation(undefined);
    }
  }

  async function changeStatus(newStatus: ChannelMemberStatus, duration?: Date) {
    if (confirmation) {
      const member = confirmation.channelMember;
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

  function handleConfirmationAction(action: ChannelMemberAction) {
    if (!confirmation) {
      return 'handleConfirmationAction error!!';
    }
    switch (action) {
      case ChannelMemberAction.CHOWN: {
        changeRole(ChannelMemberRole.OWNER);
        //set confirmation
        // changeRole(ChannelMemberRole.ADMIN);
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

  async function handleAddButtonAction() {
    console.log('HANDLE ADD BUTTON');
    const derp = await callAPI('POST', 'channel_members', {
      channel_id: 1,
      user_id: selectedFriend?.incoming_friend.id,
    });
    console.log(derp);
    const newChannelMember: ChannelMembers = JSON.parse(derp);

    setChannelMembers((channelMembers) => {
      return [...channelMembers, newChannelMember];
    });
    setFriendSearch('');
    setSelectedFriend(undefined);
  }

  //function to add a user to a channel

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <ChannelHeader />
      <DialogPrompt
        // closeHandler={async () => {}}
        buttonText='Add members button'
        dialogTitle='Add members'
        dialogDescription='Add your friends to the channel'
        labelText='username'
        textInput={friendSearch}
        backButtonText='Cancel'
        onChangeHandler={(input) => {
          setSelectedFriend(undefined);
          setFriendSearch(input);
        }}
        backHandler={async () => {}}
        actionButtonText='Add'
        handleAction={async () => {
          await handleAddButtonAction();
          return 'handleAction error';
        }}
      >
        <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
          {
            // friend display here
            friends
              .filter(
                (friend) => friend.id,
                // channel.user.username.toLowerCase(),
                // .includes(channel.user.trim().toLowerCase()),
              )
              .map((friend: Friend, index: number) => (
                <FriendDisplay
                  key={index}
                  selected={selectedFriend?.incoming_friend.id ?? 0}
                  selectCurrent={() => {
                    console.log('setSelectedFriend clicked');
                    // PLEASE FILTER ADDED FRIENDS ELSE YOU GONEZO
                    setFriendSearch(friend.incoming_friend.username);
                    setSelectedFriend(friend);
                  }}
                  friend={friend}
                ></FriendDisplay>
              ))
          }
        </Stack>
      </DialogPrompt>
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
            console.log('hi');
            handleConfirmationAction(confirmation.action);
          }}
        />
      )}
    </Stack>
  );
}
