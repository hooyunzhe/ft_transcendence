'use client';
import { Button, IconButton, ListItem, Stack } from '@mui/material';
import { HowToReg, SportsTennis } from '@mui/icons-material';
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
import { useFriendChecks, useFriends } from '@/lib/stores/useFriendStore';
import { useCurrentUser, useUserStatus } from '@/lib/stores/useUserStore';
import { useChannelSocket, useGameSocket } from '@/lib/stores/useSocketStore';
import {
  useGameActions,
  useMatchState,
  useOutgoingInviteUser,
} from '@/lib/stores/useGameStore';
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
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { User, UserStatus } from '@/types/UserTypes';
import { MatchState } from '@/types/GameTypes';

export default function ChannelMemberList({
  selectedChannel,
}: {
  selectedChannel: Channel | undefined;
}) {
  const currentUser = useCurrentUser();
  const channelMembers = useChannelMembers();
  const friends = useFriends();
  const userStatus = useUserStatus();
  const outgoingInviteUser = useOutgoingInviteUser();
  const matchState = useMatchState();
  const channelSocket = useChannelSocket();
  const gameSocket = useGameSocket();
  const {
    kickChannelMember,
    changeChannelMemberRole,
    changeChannelMemberStatus,
  } = useChannelMemberActions();
  const { isChannelAdmin, isChannelOwner } = useChannelMemberChecks();
  const { isFriendBlocked } = useFriendChecks();
  const { setOutgoingInviteUser } = useGameActions();
  const { displayTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();
  const { handleAchievementsEarned } = useAchievementActions();

  const addableFriends = friends.filter(
    (friend) =>
      friend.status === FriendStatus.FRIENDS &&
      channelMembers.every(
        (member) =>
          member.user.id !== friend.incoming_friend.id ||
          member.channel.id !== selectedChannel?.id,
      ),
  );

  function getSortOrder(member: ChannelMember): number {
    if (member.user.id === currentUser.id) {
      return 0;
    } else if (member.role === ChannelMemberRole.OWNER) {
      return 1;
    } else if (member.role === ChannelMemberRole.ADMIN) {
      return 2;
    } else {
      return 3;
    }
  }

  function sortChannelMembers(
    memberA: ChannelMember,
    memberB: ChannelMember,
  ): number {
    const sortOrderA = getSortOrder(memberA);
    const sortOrderB = getSortOrder(memberB);

    if (sortOrderA !== sortOrderB) {
      return sortOrderA - sortOrderB;
    }
    return memberA.user.username.localeCompare(memberB.user.username);
  }

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

  function hasPrivilege(member: ChannelMember): boolean {
    return (
      (member.role === ChannelMemberRole.MEMBER &&
        getCurrentRole() === ChannelMemberRole.ADMIN) ||
      (member.role !== ChannelMemberRole.OWNER &&
        getCurrentRole() === ChannelMemberRole.OWNER)
    );
  }

  // * Helper Function for update locals * //

  async function kickUser(member: ChannelMember): Promise<void> {
    if (hasPrivilege(member)) {
      await callAPI('DELETE', 'channel-members', { id: member.id });
      kickChannelMember(member.id);
      emitToSocket(channelSocket, 'kickMember', member);
      await handleAchievementsEarned(currentUser.id, 4, displayNotification);
      displayNotification(
        'success',
        `Channel member ${member.user.username} kicked`,
      );
    } else {
      displayNotification(
        'error',
        'You are no longer an admin, unable to kick',
      );
    }
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
    if (hasPrivilege(member)) {
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
    } else {
      displayNotification(
        'error',
        'You are no longer an admin, unable to unmute',
      );
    }
  }

  async function banMember(member: ChannelMember) {
    if (hasPrivilege(member)) {
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
    } else {
      displayNotification('error', 'You are no longer an admin, unable to ban');
    }
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

  function handleInvite(opponent: User): void {
    if (gameSocket) {
      if (outgoingInviteUser) {
        gameSocket.emit('cancelInvite', {
          user: currentUser,
          opponent_id: outgoingInviteUser.id,
        });
        setOutgoingInviteUser(undefined);
        displayNotification('error', 'Invite canceled');
      }
      if (opponent.id !== outgoingInviteUser?.id) {
        gameSocket.emit('sendInvite', {
          user: currentUser,
          opponent_id: opponent.id,
        });
        setOutgoingInviteUser(opponent);
        displayNotification('success', 'Invite sent');
      }
    }
  }

  return (
    <Stack
      direction='column'
      justifyContent='center'
      spacing={1}
      padding='7px'
      overflow='hidden'
    >
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
      <Stack
        spacing={1}
        sx={{
          overflow: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {channelMembers
          .filter(
            (member) =>
              member.channel.id === selectedChannel?.id &&
              member.status !== ChannelMemberStatus.BANNED &&
              (member.user.id !== currentUser.id ||
                member.channel.type !== ChannelType.DIRECT) &&
              !isFriendBlocked(member.user.id),
          )
          .sort(sortChannelMembers)
          .map((member: ChannelMember, index: number) => (
            <ListItem
              key={index}
              sx={{
                border: 'solid 3px #4a4eda',
                borderRadius: '10px',
                // bgcolor: '#A4B5C6',
                background:
                  userStatus[member.user.id] === UserStatus.IN_GAME
                    ? 'linear-gradient(90deg, #e85149, #363bd6)'
                    : '#A4B5C6',
              }}
              component='div'
            >
              <ChannelMemberDisplay
                user={member.user}
                status={userStatus[member.user.id]}
                member={member}
                currentUserRole={getCurrentRole()}
                handleAction={handleDisplayAction}
              />
              {member.user.id !== currentUser.id && (
                <IconButton
                  disabled={
                    matchState !== MatchState.IDLE ||
                    userStatus[member.user.id] !== UserStatus.ONLINE
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleInvite(member.user)}
                >
                  {outgoingInviteUser?.id === member.user.id ? (
                    <HowToReg />
                  ) : (
                    <SportsTennis />
                  )}
                </IconButton>
              )}
            </ListItem>
          ))}
      </Stack>
    </Stack>
  );
}
