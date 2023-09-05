'use client';
import { Button, IconButton, ListItem, Stack } from '@mui/material';
import { SportsTennis } from '@mui/icons-material';
import ChannelMemberAddPrompt from './ChannelMemberAddPrompt';
import ChannelMemberDisplay from './ChannelMemberDisplay';
import ChannelMemberMutePrompt from './ChannelMemberMutePrompt';
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
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { FriendStatus } from '@/types/FriendTypes';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { ChannelType } from '@/types/ChannelTypes';

export default function ChannelMemberList() {
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
  const { displayTwoFactor } = useTwoFactorActions();
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
    if (selectedChannel) {
      if (isChannelOwner(currentUser.id, selectedChannel.id)) {
        return ChannelMemberRole.OWNER;
      }
      if (isChannelAdmin(currentUser.id, selectedChannel.id))
        return ChannelMemberRole.ADMIN;
    }
    return ChannelMemberRole.MEMBER;
  }

  // * Helper Function for update locals * //

  async function kickUser(member: ChannelMember): Promise<void> {
    await callAPI('DELETE', 'channel-members', { id: member.id });
    kickChannelMember(member.id);
    emitToSocket(channelSocket, 'kickMember', member);
    await handleAchievementsEarned(currentUser.id, 4, displayNotification).then(
      (earned) =>
        earned &&
        displayNotification(
          'success',
          `Channel member ${member.user.username} kicked`,
        ),
    );
  }

  async function changeToAdmin(member: ChannelMember) {
    await callAPI('PATCH', 'channel-members/', {
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
    displayNotification(
      'success',
      `Channel member ${member.user.username} is now an admin`,
    );
  }

  async function changeToMember(member: ChannelMember) {
    await callAPI('PATCH', 'channel-members/', {
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
    displayNotification(
      'success',
      `Channel member ${member.user.username} is now a member`,
    );
  }

  async function unmuteMember(member: ChannelMember) {
    await callAPI('PATCH', 'channel-members', {
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
    displayNotification(
      'success',
      `Channel member ${member.user.username} unmuted`,
    );
  }

  async function banMember(member: ChannelMember) {
    await callAPI('PATCH', 'channel-members', {
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
    displayNotification(
      'success',
      `Channel member ${member.user.username} banned`,
    );
  }

  async function changeOwnership(newOwner: ChannelMember) {
    const currentOwner = channelMembers.find(
      (member) =>
        member.user.id === currentUser.id &&
        member.channel.id === newOwner.channel.id,
    );
    if (currentOwner === undefined) {
      console.log('FATAL ERROR: CURRENT OWNER NOT FOUND!');
      return undefined;
    }
    await callAPI('PATCH', 'channel-members', {
      id: currentOwner.id,
      role: ChannelMemberRole.ADMIN,
    });
    callAPI('PATCH', 'channel-members', {
      id: newOwner.id,
      role: ChannelMemberRole.OWNER,
    });
    changeChannelMemberRole(currentOwner.id, ChannelMemberRole.ADMIN);
    changeChannelMemberRole(newOwner.id, ChannelMemberRole.OWNER);
    const newOwnerData = {
      memberID: newOwner.id,
      channelID: newOwner.channel.id,
      newRole: ChannelMemberRole.OWNER,
    };
    const oldOwnerData = {
      memberID: currentOwner.id,
      channelID: newOwner.channel.id,
      newRole: ChannelMemberRole.ADMIN,
    };
    emitToSocket(channelSocket, 'changeRole', newOwnerData);
    emitToSocket(channelSocket, 'changeRole', oldOwnerData);
    displayNotification(
      'success',
      `Channel ownership transferred to ${newOwner.user.username}`,
    );
  }

  // * Action handlers that are passed into components * //

  async function handleDisplayAction(
    member: ChannelMember,
    action: ChannelMemberAction,
  ) {
    switch (action) {
      case ChannelMemberAction.CHOWN:
        return displayTwoFactor(() =>
          displayConfirmation(
            'Change Ownership to ' + member.user.username + '?',
            'You are transfering the ownership of this server.',
            member,
            changeOwnership,
          ),
        );
      case ChannelMemberAction.KICK:
        return displayTwoFactor(() =>
          displayConfirmation(
            'Kick user ' + member.user.username + '?',
            'You are booting the user from the channel.',
            member,
            kickUser,
          ),
        );
      case ChannelMemberAction.ADMIN:
        return displayTwoFactor(() =>
          displayConfirmation(
            'Make ' + member.user.username + ' an admin?',
            'You are making this user admin.',
            member,
            changeToAdmin,
          ),
        );
      case ChannelMemberAction.UNADMIN:
        return displayTwoFactor(() =>
          displayConfirmation(
            'Remove admin privileges from ' + member.user.username + '?',
            'You are removing admin from this user.',
            member,
            changeToMember,
          ),
        );
      case ChannelMemberAction.BAN:
        return displayTwoFactor(() =>
          displayConfirmation(
            'Ban ' + member.user.username + '?',
            'You are banning this user from this channel.',
            member,
            banMember,
          ),
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
    <Stack direction='column' justifyContent='center' spacing={1} padding='7px'>
      {selectedChannel &&
        (isChannelAdmin(currentUser.id, selectedChannel.id) ||
          isChannelOwner(currentUser.id, selectedChannel.id)) && (
          <Button
            variant='contained'
            sx={{
              bgcolor: '#4CC9F080',
              ':hover': {
                bgcolor: '#8A7DD6',
              },
            }}
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
            (member.user.id !== currentUser.id ||
              member.channel.type !== ChannelType.DIRECT) &&
            !isFriendBlocked(member.user.id),
        )
        .map((member: ChannelMember, index: number) => (
          <ListItem
            key={index}
            sx={{
              border: 'solid 3px #4a4eda',
              borderRadius: '10px',
              bgcolor: '#A4B5C6',
            }}
            component='div'
          >
            <ChannelMemberDisplay
              user={member.user}
              member={member}
              currentUserRole={getCurrentRole()}
              handleAction={handleDisplayAction}
            />
            {member.user.id !== currentUser.id && (
              <IconButton onClick={() => null}>
                <SportsTennis />
              </IconButton>
            )}
          </ListItem>
        ))}
    </Stack>
  );
}
