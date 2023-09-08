'use client';
import { Button, Stack } from '@mui/material';
import FriendAddPrompt from './FriendAddPrompt';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import {
  useChannelActions,
  useChannelChecks,
} from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useChannelSocket, useFriendSocket } from '@/lib/stores/useSocketStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { Friend, FriendStatus, FriendAction } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';
import { ChannelType } from '@/types/ChannelTypes';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { FriendCategory } from '@/types/UtilTypes';

export default function FriendStack() {
  const currentUser = useCurrentUser();
  const friendSocket = useFriendSocket();
  const channelSocket = useChannelSocket();
  const { changeFriend, deleteFriend, resetSelectedFriend } =
    useFriendActions();
  const { addChannel, addJoinedChannel, resetSelectedDirectChannel } =
    useChannelActions();
  const { checkChannelExists } = useChannelChecks();
  const { addChannelMember } = useChannelMemberActions();
  const { displayDialog } = useDialogActions();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();
  const { setCurrentFriendCategory } = useUtilActions();
  const { handleAchievementsEarned } = useAchievementActions();

  async function callFriendsAPI(
    method: string,
    incoming_friend: User,
    action?: FriendAction,
  ): Promise<void> {
    await callAPI(method, 'friends', {
      outgoing_id: currentUser.id,
      incoming_id: incoming_friend.id,
      ...(action && { action: action }),
    });
  }

  async function createDirectChannel(
    directChannelName: string,
    incomingID: number,
  ): Promise<void> {
    const newDirectChannel = await callAPI('POST', 'channels', {
      name: directChannelName,
      type: ChannelType.DIRECT,
    }).then((res) => res.body);

    if (newDirectChannel) {
      addChannel(newDirectChannel);
      emitToSocket(channelSocket, 'newChannel', newDirectChannel);

      const friendMember = await callAPI('POST', 'channel-members', {
        channel_id: newDirectChannel.id,
        user_id: incomingID,
        role: ChannelMemberRole.MEMBER,
      }).then((res) => res.body);

      const selfMember = await callAPI('POST', 'channel-members', {
        channel_id: newDirectChannel.id,
        user_id: currentUser.id,
        role: ChannelMemberRole.MEMBER,
      }).then((res) => res.body);

      if (friendMember && selfMember) {
        addJoinedChannel(newDirectChannel.id);
        addChannelMember(friendMember);
        addChannelMember(selfMember);
        emitToSocket(channelSocket, 'newMember', friendMember);
        emitToSocket(channelSocket, 'joinRoom', newDirectChannel.id);
      } else {
        console.log('FATAL ERROR: FAILED TO ADD DM MEMBERS IN BACKEND');
      }
    } else {
      console.log('FATAL ERROR: FAILED TO CREATE DIRECT CHANNEL IN BACKEND');
    }
  }

  async function acceptFriendRequest(request: Friend): Promise<void> {
    await callFriendsAPI('PATCH', request.incoming_friend, FriendAction.ACCEPT);
    changeFriend(request, FriendStatus.PENDING, FriendStatus.FRIENDS);
    emitToSocket(friendSocket, 'acceptRequest', request);
    displayNotification('success', 'Request accepted');
    setCurrentFriendCategory(FriendCategory.FRIENDS);

    const directChannelName = `${request.incoming_friend.id}+${currentUser.id}DM`;
    if (!checkChannelExists(directChannelName)) {
      createDirectChannel(directChannelName, request.incoming_friend.id);
    }
  }

  async function rejectFriendRequest(request: Friend): Promise<void> {
    await callFriendsAPI('PATCH', request.incoming_friend, FriendAction.REJECT);
    deleteFriend(request);
    emitToSocket(friendSocket, 'rejectRequest', request);
    displayNotification('error', 'Request rejected');
  }

  async function removeFriendRequest(request: Friend): Promise<void> {
    await callFriendsAPI('DELETE', request.incoming_friend);
    deleteFriend(request);
    emitToSocket(friendSocket, 'deleteRequest', request);
    displayNotification('error', 'Request removed');
  }

  async function blockFriend(friendship: Friend): Promise<void> {
    await callFriendsAPI(
      'PATCH',
      friendship.incoming_friend,
      FriendAction.BLOCK,
    );
    changeFriend(friendship, FriendStatus.FRIENDS, FriendStatus.BLOCKED);
    displayNotification(
      'warning',
      'Blocked ' + friendship.incoming_friend.username,
    );
    resetSelectedFriend(friendship.incoming_friend.id);
    resetSelectedDirectChannel(currentUser.id, friendship.incoming_friend.id);
  }

  async function unblockFriend(friendship: Friend): Promise<void> {
    await callFriendsAPI(
      'PATCH',
      friendship.incoming_friend,
      FriendAction.UNBLOCK,
    );
    changeFriend(friendship, FriendStatus.BLOCKED, FriendStatus.FRIENDS);
    displayNotification(
      'warning',
      'Unblocked ' + friendship.incoming_friend.username,
    );
  }

  async function removeFriend(friendship: Friend): Promise<void> {
    await callFriendsAPI('DELETE', friendship.incoming_friend);
    deleteFriend(friendship);
    emitToSocket(friendSocket, 'deleteFriend', friendship);
    await handleAchievementsEarned(currentUser.id, 2, displayNotification).then(
      (earned) =>
        earned &&
        displayNotification(
          'error',
          'Unfriended ' + friendship.incoming_friend.username,
        ),
    );
    resetSelectedFriend(friendship.incoming_friend.id);
    resetSelectedDirectChannel(currentUser.id, friendship.incoming_friend.id);
  }

  function handleAction(request: Friend, action: FriendAction): void {
    switch (action) {
      case FriendAction.ACCEPT:
        acceptFriendRequest(request);
        break;
      case FriendAction.REJECT:
        rejectFriendRequest(request);
        break;
      case FriendAction.REMOVE:
        removeFriendRequest(request);
        break;
      case FriendAction.BLOCK: {
        displayConfirmation(
          'Block ',
          'You will not see ' +
            request.incoming_friend.username +
            "'s messages anymore!",
          request,
          blockFriend,
        );
        break;
      }
      case FriendAction.UNBLOCK: {
        displayConfirmation(
          'Unblock ',
          'You will now see ' +
            request.incoming_friend.username +
            "'s messages!",
          request,
          unblockFriend,
        );
        break;
      }
      case FriendAction.UNFRIEND: {
        displayConfirmation(
          'Unfriend ',
          'This action is permanent!',
          request,
          removeFriend,
        );
        break;
      }
    }
  }

  return (
    <Stack
      direction='column'
      justifyContent='center'
      spacing={1}
      padding='7px'
      sx={{
        overflow: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          displayDialog(
            'Add Friend',
            'Add people to your friend list',
            <FriendAddPrompt />,
            'Add',
          )
        }
      >
        Add Friend
      </Button>
      <Stack
        spacing={1}
        sx={{
          p: '5px 2px',
          overflow: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {Object.keys(FriendCategory).map((category, index) => (
          <FriendDropdown
            key={index}
            category={category as FriendCategory}
            handleAction={handleAction}
          />
        ))}
      </Stack>
    </Stack>
  );
}
