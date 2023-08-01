'use client';
import { useState } from 'react';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import { User } from '@/types/UserTypes';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useFriendSocket } from '@/lib/stores/useSocketStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function FriendAddPrompt() {
  const currentUser = useCurrentUser();
  const friends = useFriends();
  const { addFriend } = useFriendActions();
  const friendSocket = useFriendSocket();
  const { displayNotification } = useNotificationActions();
  const [username, setUsername] = useState('');

  async function getUserByName(name: string): Promise<User | null> {
    return fetch(
      process.env.NEXT_PUBLIC_HOST_URL +
        ':4242/api/users?search_type=NAME&search_string=' +
        name,
      {
        cache: 'no-store',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    ).then((res) => (res.ok ? res.json() : null));
  }

  function checkFriendship(incomingID: number): string {
    const friendshipFound = friends.find(
      (friend: Friend) => friend.incoming_friend.id === incomingID,
    );

    if (friendshipFound) {
      switch (friendshipFound.status) {
        case FriendStatus.FRIENDS:
          return 'User is already a friend';
        case FriendStatus.PENDING:
          return 'User already invited you';
        case FriendStatus.INVITED:
          return 'User already invited';
        case FriendStatus.BLOCKED:
          return 'User already blocked';
      }
    }
    return '';
  }

  async function handleAddFriendAction(): Promise<string> {
    const userToAdd = await getUserByName(username);
    if (!userToAdd) {
      return 'User not found';
    }
    const errorMessage = checkFriendship(userToAdd.id);
    if (errorMessage) {
      return errorMessage;
    }
    if (userToAdd.id === currentUser.id) {
      return 'No, you cannot add yourself smartie pants';
    }

    const newRequests = JSON.parse(
      await callAPI('POST', 'friends', {
        outgoing_id: currentUser.id,
        incoming_id: userToAdd.id,
      }),
    );

    addFriend(newRequests[0]);
    emitToSocket(friendSocket, 'newRequest', {
      outgoing_request: newRequests[0],
      incoming_request: newRequests[1],
    });
    displayNotification('success', 'Request sent');
    return '';
  }

  return (
    <DialogPrompt
      buttonText='Add Friend'
      dialogTitle='Send friend request'
      dialogDescription='Add friends by their username'
      labelText='Username'
      textInput={username}
      onChangeHandler={(input) => setUsername(input)}
      backButtonText='Cancel'
      backHandler={() => {}}
      actionButtonText='Send'
      handleAction={handleAddFriendAction}
    />
  );
}
