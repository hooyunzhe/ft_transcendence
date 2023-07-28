'use client';
import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import { useFriends } from '@/lib/stores/useFriendStore';
import { User } from '@/types/UserTypes';
import { Friend, FriendStatus } from '@/types/FriendTypes';

interface FriendAddPromptProps {
  sendFriendRequest: (user: User) => Promise<void>;
}

export default function FriendAddPrompt({
  sendFriendRequest,
}: FriendAddPromptProps) {
  const friends = useFriends();
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
    sendFriendRequest(userToAdd);
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
