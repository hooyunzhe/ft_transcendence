'use client';
import { Button, ListItem, ListItemIcon, Paper, Stack } from '@mui/material';
import { LocalPolice, Shield } from '@mui/icons-material';
import { ChannelMemberAddPrompt } from './ChannelMemberAddPrompt';
import ChannelMemberDisplay from './ChannelMemberDisplay';
import ChannelMemberActionMenu from './ChannelMemberActionMenu';
import { ChannelMemberMutePrompt } from './ChannelMemberMutePrompt';
import ListHeader from '../utils/ListHeader';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
  useChannelMembers,
} from '@/lib/stores/useChannelMemberStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useFriendChecks, useFriends } from '@/lib/stores/useFriendStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { FriendStatus } from '@/types/FriendTypes';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { ListHeaderIcon } from '@/types/UtilTypes';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';

export function ChannelMemberList() {
  const selectedChannel = useSelectedChannel();
  const currentUser = useCurrentUser();
  const channelMembers = useChannelMembers();
  const friends = useFriends();
  const channelSocket = useChannelSocket();
  const {
    kickChannelMember,
    changeChannelMemberRole,
    changeChannelMemberStatus,
  } = useChannelMemberActions();
  const { isChannelAdmin, isChannelOwner } = useChannelMemberChecks();
  const { isFriendBlocked } = useFriendChecks();
  const { displayDialog } = useDialogActions();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();
  const { handleAchievementsEarned } = useAchievementActions();

  const addableFriends = friends.filter(
    (friend) =>
      friend.status === FriendStatus.FRIENDS &&
      channelMembers.every((member) => {
        return (
          member.user.id !== friend.incoming_friend.id ||
          member.channel.id !== selectedChannel?.id
        );
      }),
  );

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

  // * Helper Function for update locals * //

  async function kickUser(member: ChannelMember): Promise<void> {
    callAPI('DELETE', 'channel-members', { id: member.id });
    kickChannelMember(member.id);
    emitToSocket(channelSocket, 'kickMember', member);
    const kickMemberAchievement = await handleAchievementsEarned(
      currentUser.id,
      3,
      displayNotification,
    );
    if (!kickMemberAchievement)
      displayNotification('success', 'Channel member kicked');
  }

  async function changeToAdmin(member: ChannelMember) {
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

  async function changeToMember(member: ChannelMember) {
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

  async function unmuteMember(member: ChannelMember) {
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      status: ChannelMemberStatus.DEFAULT,
    });
    changeChannelMemberStatus(member.id, ChannelMemberStatus.DEFAULT);
    const data = {
      memberID: member.id,
      userID: member.user.id,
      channelID: member.channel.id,
      newStatus: ChannelMemberStatus.DEFAULT,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel member unmuted');
  }

  async function banMember(member: ChannelMember) {
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      status: ChannelMemberStatus.BANNED,
      muted_until: new Date().toISOString(),
    });
    changeChannelMemberStatus(member.id, ChannelMemberStatus.BANNED);
    const data = {
      memberID: member.id,
      userID: member.user.id,
      channelID: member.channel.id,
      newStatus: ChannelMemberStatus.BANNED,
    };
    emitToSocket(channelSocket, 'changeStatus', data);
    displayNotification('success', 'Channel member banned');
  }

  async function changeOwnership(member: ChannelMember) {
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
    callAPI('PATCH', 'channel-members', {
      id: currentOwner.id,
      role: ChannelMemberRole.ADMIN,
    });
    callAPI('PATCH', 'channel-members', {
      id: member.id,
      role: ChannelMemberRole.OWNER,
    });
    changeChannelMemberRole(currentOwner.id, ChannelMemberRole.ADMIN);
    changeChannelMemberRole(member.id, ChannelMemberRole.OWNER);
    const newOwnerData = {
      memberID: member.id,
      channelID: member.channel.id,
      newRole: ChannelMemberRole.OWNER,
    };
    const oldOwnerData = {
      memberID: currentOwner.id,
      channelID: member.channel.id,
      newRole: ChannelMemberRole.ADMIN,
    };
    emitToSocket(channelSocket, 'changeRole', newOwnerData);
    emitToSocket(channelSocket, 'changeRole', oldOwnerData);
    displayNotification('success', 'Channel ownership transferred');
  }

  // * Action handlers that are passed into components * //

  async function handleDisplayAction(
    member: ChannelMember,
    action: ChannelMemberAction,
  ) {
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
      case ChannelMemberAction.MUTE:
        return displayDialog(
          'Mute member',
          'You are muting this user. He would not be able to chat',
          <ChannelMemberMutePrompt member={member} />,
          'Mute',
          false,
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

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <ListHeader title='Members' icon={ListHeaderIcon.NONE} />
      {selectedChannel && (
        <Button
          variant='contained'
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            displayDialog(
              'Add Member',
              addableFriends.length
                ? `Add members to ${selectedChannel.name}`
                : 'No friends to add... why not send someone a friend request first?',
              <ChannelMemberAddPrompt
                addableFriends={addableFriends}
                selectedChannel={selectedChannel}
              />,
              'Add',
            )
          }
        >
          Add Member
        </Button>
      )}
      {channelMembers
        .filter(
          (member) =>
            member.channel.id === selectedChannel?.id &&
            member.status !== ChannelMemberStatus.BANNED &&
            !isFriendBlocked(member.user.id),
        )
        .map((member: ChannelMember, index: number) => (
          <Paper key={index} elevation={2}>
            <ListItem component='div'>
              <ChannelMemberDisplay key={index} user={member.user} />
              {member.role === ChannelMemberRole.OWNER && (
                <ListItemIcon>
                  <LocalPolice />
                </ListItemIcon>
              )}
              {member.role === ChannelMemberRole.ADMIN && (
                <ListItemIcon>
                  <Shield />
                </ListItemIcon>
              )}
              {member.role !== ChannelMemberRole.OWNER && (
                <ChannelMemberActionMenu
                  member={member}
                  currentUserRole={getCurrentRole()}
                  handleAction={handleDisplayAction}
                />
              )}
            </ListItem>
          </Paper>
        ))}
    </Stack>
  );
}
