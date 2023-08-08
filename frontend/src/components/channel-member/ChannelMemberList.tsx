'use client';
import callAPI from '@/lib/callAPI';
import {
  ChannelMembers,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { Button, ListItem, Paper, Stack } from '@mui/material';
import { ChannelMemberAddPrompt } from './ChannelMemberAddPrompt';
import ListHeader from '../utils/ListHeader';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import emitToSocket from '@/lib/emitToSocket';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { ChannelMemberMutePrompt } from './ChannelMemberMutePrompt';
import ChannelMemberActionMenu from './ChannelMemberActionMenu';
import ChannelMemberDisplay from './ChannelMemberDisplay';
import { useFriendChecks } from '@/lib/stores/useFriendStore';

export function ChannelMemberList() {
  const channelMembers = useChannelMembers();
  const {
    addChannelMember,
    kickChannelMember,
    changeChannelMemberRole,
    changeChannelMemberStatus,
  } = useChannelMemberActions();
  const channelSocket = useChannelSocket();
  const selectedChannel = useSelectedChannel();
  const currentUser = useCurrentUser();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();
  const { displayDialog } = useDialogActions();
  const { isChannelAdmin, isChannelOwner } = useChannelMemberChecks();
  const { isFriendBlocked } = useFriendChecks();

  function getCurrentRole(): ChannelMemberRole {
    if (!selectedChannel?.id) {
      return ChannelMemberRole.MEMBER;
    }
    if (isChannelOwner(currentUser.id, selectedChannel?.id)) {
      return ChannelMemberRole.OWNER;
    }
    if (isChannelAdmin(currentUser.id, selectedChannel?.id))
      return ChannelMemberRole.ADMIN;
    else {
      return ChannelMemberRole.MEMBER;
    }
  }

  const currentRole = getCurrentRole();

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

    addChannelMember(newChannelMember);
    emitToSocket(channelSocket, 'newMember', newChannelMember);
    displayNotification('success', 'Channel member added');
    return '';
  }

  async function kickUser(member: ChannelMembers): Promise<string> {
    callAPI('DELETE', 'channel-members', { id: member.id });
    kickChannelMember(member.id);
    emitToSocket(channelSocket, 'kickMember', member);
    displayNotification('success', 'Channel member kicked');
    return '';
  }

  async function changeToAdmin(member: ChannelMembers) {
    callAPI('PATCH', 'channel-members/', {
      id: member.id,
      role: ChannelMemberRole.ADMIN,
    });
    changeChannelMemberRole(member.id, ChannelMemberRole.ADMIN);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      newRole: ChannelMemberRole.ADMIN,
    };
    emitToSocket(channelSocket, 'changeRole', data);
    displayNotification('success', 'Channel member is now an admin');
  }

  async function changeToMember(member: ChannelMembers) {
    callAPI('PATCH', 'channel-members/', {
      id: member.id,
      role: ChannelMemberRole.MEMBER,
    });
    changeChannelMemberRole(member.id, ChannelMemberRole.MEMBER);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      newRole: ChannelMemberRole.MEMBER,
    };
    emitToSocket(channelSocket, 'changeRole', data);
    displayNotification('success', 'Channel member is now a member');
  }

  async function unmuteMember(member: ChannelMembers) {
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      status: ChannelMemberStatus.DEFAULT,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(member.id, ChannelMemberStatus.DEFAULT);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      userID: member.user.id,
      newStatus: ChannelMemberStatus.DEFAULT,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel member unmuted');
  }

  async function muteMember(member: ChannelMembers, duration?: Date) {
    console.log('--Date\n--', new Date().toISOString());
    console.log('-GG-: \n', duration);
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      status: ChannelMemberStatus.MUTED,
      muted_until: duration,
    });
    changeChannelMemberStatus(member.id, ChannelMemberStatus.MUTED);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      userID: member.user.id,
      newStatus: ChannelMemberStatus.MUTED,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel member muted');
  }

  async function banMember(member: ChannelMembers) {
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      status: ChannelMemberStatus.BANNED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(member.id, ChannelMemberStatus.BANNED);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      userID: member.user.id,
      newStatus: ChannelMemberStatus.BANNED,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel member banned');
  }

  async function changeOwnership(member: ChannelMembers) {
    const currentOwner = channelMembers.find((owner) => {
      if (owner.role === ChannelMemberRole.OWNER) {
        return owner.id;
      }
      return undefined;
    });
    if (currentOwner === undefined) {
      console.log('FATAL ERROR: CURRENT OWNER NOT FOUND!');
      return undefined;
    }
    changeChannelMemberStatus(member.id, ChannelMemberStatus.BANNED);
    callAPI('PATCH', 'channel-members', {
      id: currentOwner.id,
      role: ChannelMemberRole.ADMIN,
    });
    changeChannelMemberRole(currentOwner.id, ChannelMemberRole.ADMIN);
    const data = {
      memberID: member.id,
      channelID: member.channel.id,
      newRole: ChannelMemberRole.ADMIN,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel ownership transferred');
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
          member,
          changeOwnership,
        );
      case ChannelMemberAction.KICK:
        return displayConfirmation(
          'Kick user ' + member.user.username + '?',
          'You are booting the user from the channel.',
          member,
          kickUser,
        );
      case ChannelMemberAction.ADMIN:
        return displayConfirmation(
          'Make ' + member.user.username + ' an admin?',
          'You are making this user admin.',
          member,
          changeToAdmin,
        );
      case ChannelMemberAction.UNADMIN:
        return displayConfirmation(
          'Remove admin privileges from ' + member.user.username + '?',
          'You are removing admin from this user.',
          member,
          changeToMember,
        );
      case ChannelMemberAction.BAN:
        return displayConfirmation(
          'Ban ' + member.user.username + '?',
          'You are banning this user from this channel.',
          member,
          banMember,
        );
      case ChannelMemberAction.UNBAN:
        return displayConfirmation(
          'Unban ' + member.user.username + '?',
          'You are unbanning this user from this channel.',
          member,
          kickUser,
        );
      case ChannelMemberAction.MUTE:
        return displayDialog(
          'Mute member',
          'You are muting this user. He would not be able to chat',
          <ChannelMemberMutePrompt member={member} muteUser={muteMember} />,
          'Mute',
        );

      case ChannelMemberAction.UNMUTE:
        return displayConfirmation(
          'Unmute ' + member.user.username + '?',
          'You are unmuting this user. He will be able to chat again',
          member,
          unmuteMember,
        );
    }
  }

  return selectedChannel ? (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <ListHeader title='Members' />
      <Button
        variant='contained'
        onClick={() =>
          displayDialog(
            'Add Member',
            'Add members here',
            <ChannelMemberAddPrompt
              addUser={addUser}
              selectedChannel={selectedChannel}
            />,
            'Add',
          )
        }
      >
        Add Member
      </Button>
      {channelMembers
        .filter(
          (member) =>
            member.channel.id === selectedChannel.id &&
            member.status === ChannelMemberStatus.DEFAULT &&
            !isFriendBlocked(member.user.id),
        )
        .map((member: ChannelMembers, index: number) => (
          <Paper key={index} elevation={2}>
            <ListItem>
              <ChannelMemberDisplay
                key={index}
                user={member.user}
                role={member.role}
              />
              {member.role !== ChannelMemberRole.OWNER && (
                <ChannelMemberActionMenu
                  member={member}
                  currentUserRole={currentRole}
                  handleAction={handleDisplayAction}
                />
              )}
            </ListItem>
          </Paper>
        ))}
    </Stack>
  ) : (
    <ListHeader title='Members' />
  );
}
