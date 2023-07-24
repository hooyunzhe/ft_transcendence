'use client';
import { Stack } from '@mui/material';
import { useEffect } from 'react';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { Friend, FriendStatus, FriendAction } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useFriendSocket, useUserSocket } from '@/lib/stores/useSocketStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import FriendAddPrompt from './FriendAddPrompt';
import emitToSocket from '@/lib/emitToSocket';

export default function FriendList() {
  const currentUser = useCurrentUser();
  const friends = useFriends();
  const { addFriend, changeFriend, deleteFriend } = useFriendActions();
  const { addUserStatus } = useUserActions();
  const userSocket = useUserSocket();
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
  async function sendFriendRequest(user: User): Promise<void> {
    const newRequests = JSON.parse(await callFriendsAPI('POST', user));

    addFriend(newRequests[0]);
    emitToSocket(friendSocket, 'newRequest', {
      outgoing_request: newRequests[0],
      incoming_request: newRequests[1],
    });
    displayNotification('success', 'Request sent');
  }

  function acceptFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.ACCEPT);
    changeFriend(
      request.incoming_friend.id,
      FriendStatus.PENDING,
      FriendStatus.FRIENDS,
    );
    emitToSocket(friendSocket, 'acceptRequest', { friendship: request });
    displayNotification('success', 'Request accepted');
  }

  function rejectFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.REJECT);
    deleteFriend(request.incoming_friend.id);
    emitToSocket(friendSocket, 'rejectRequest', { friendship: request });
    displayNotification('error', 'Request rejected');
  }

  function removeFriendRequest(request: Friend): void {
    callFriendsAPI('DELETE', request.incoming_friend);
    deleteFriend(request.incoming_friend.id);
    emitToSocket(friendSocket, 'deleteRequest', { friendship: request });
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

  useEffect(() => {
    if (userSocket) {
      addUserStatus(
        userSocket,
        friends.map((friend: Friend) => friend.incoming_friend.id),
      );
    }
  }, [friends.length]);

  const categories = ['friends', 'pending', 'invited', 'blocked'];

  return (
    <Stack width='100%' direction='column' justifyContent='center' spacing={1}>
      <FriendAddPrompt sendFriendRequest={sendFriendRequest} />
      {categories.map((category, index) => (
        <FriendDropdown
          key={index}
          category={category}
          handleAction={handleAction}
        />
      ))}
    </Stack>
  );
}
