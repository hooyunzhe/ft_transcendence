'use client';
import { Stack } from '@mui/material';
import FriendAddPrompt from './FriendAddPrompt';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import { User } from '@/types/UserTypes';
import { Friend, FriendStatus, FriendAction } from '@/types/FriendTypes';
import { useFriendSocket } from '@/lib/stores/useSocketStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function FriendStack() {
  const currentUser = useCurrentUser();
  const { changeFriend, deleteFriend } = useFriendActions();
  const friendSocket = useFriendSocket();
  const { displayConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();

  async function callFriendsAPI(
    method: string,
    incoming_friend: User,
    action?: FriendAction,
  ): Promise<string> {
    return callAPI(method, 'friends', {
      outgoing_id: currentUser.id,
      incoming_id: incoming_friend.id,
      ...(action && { action: action }),
    });
  }

  function acceptFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.ACCEPT);
    changeFriend(
      request.incoming_friend.id,
      FriendStatus.PENDING,
      FriendStatus.FRIENDS,
    );
    emitToSocket(friendSocket, 'acceptRequest', request);
    displayNotification('success', 'Request accepted');
  }

  function rejectFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.REJECT);
    deleteFriend(request.incoming_friend.id);
    emitToSocket(friendSocket, 'rejectRequest', request);
    displayNotification('error', 'Request rejected');
  }

  function removeFriendRequest(request: Friend): void {
    callFriendsAPI('DELETE', request.incoming_friend);
    deleteFriend(request.incoming_friend.id);
    emitToSocket(friendSocket, 'deleteRequest', request);
    displayNotification('error', 'Request removed');
  }

  function blockFriend(friendship: Friend): void {
    callFriendsAPI('PATCH', friendship.incoming_friend, FriendAction.BLOCK);
    changeFriend(
      friendship.incoming_friend.id,
      FriendStatus.FRIENDS,
      FriendStatus.BLOCKED,
    );
    displayNotification(
      'warning',
      'Blocked ' + friendship.incoming_friend.username,
    );
  }

  function unblockFriend(friendship: Friend): void {
    callFriendsAPI('PATCH', friendship.incoming_friend, FriendAction.UNBLOCK);
    changeFriend(
      friendship.incoming_friend.id,
      FriendStatus.BLOCKED,
      FriendStatus.FRIENDS,
    );
    displayNotification(
      'warning',
      'Blocked ' + friendship.incoming_friend.username,
    );
  }

  function removeFriend(friendship: Friend): void {
    callFriendsAPI('DELETE', friendship.incoming_friend);
    deleteFriend(friendship.incoming_friend.id);
    emitToSocket(friendSocket, 'deleteRequest', friendship);
    displayNotification(
      'error',
      'Unfriended ' + friendship.incoming_friend.username,
    );
  }

  function handleAction(request: Friend, action: FriendAction): void {
    switch (action) {
      case FriendAction.ACCEPT:
        return acceptFriendRequest(request);
      case FriendAction.REJECT:
        return rejectFriendRequest(request);
      case FriendAction.REMOVE:
        return removeFriendRequest(request);
      case FriendAction.BLOCK: {
        return displayConfirmation(
          'Block ',
          'You will not see ' +
            request.incoming_friend.username +
            "'s messages anymore!",
          request,
          blockFriend,
        );
      }
      case FriendAction.UNBLOCK: {
        return displayConfirmation(
          'Unblock ',
          'You will now see ' +
            request.incoming_friend.username +
            "'s messages!",
          request,
          unblockFriend,
        );
      }
      case FriendAction.UNFRIEND: {
        return displayConfirmation(
          'Unfriend ',
          'This action is permanent!',
          request,
          removeFriend,
        );
      }
    }
  }

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <FriendAddPrompt />
      <FriendDropdown category='friends' handleAction={handleAction} />
      <FriendDropdown category='pending' handleAction={handleAction} />
      <FriendDropdown category='invited' handleAction={handleAction} />
      <FriendDropdown category='blocked' handleAction={handleAction} />
    </Stack>
  );
}
