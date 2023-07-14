'use client';
import { AlertColor, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { Friend, FriendStatus, FriendAction } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import NotificationBar from '../utils/NotificationBar';
import DialogPrompt from '../utils/DialogPrompt';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import {
  useCurrentUser,
  useUserActions,
  useUserStatus,
} from '@/lib/stores/useUserStore';
import { useFriendSocket, useUserSocket } from '@/lib/stores/useSocketStore';

export default function FriendList() {
  const currentUser = useCurrentUser();
  const friends = useFriends();
  const { setFriends, addFriend, changeFriend, deleteFriend } =
    useFriendActions();
  const userStatus = useUserStatus();
  const { addUserStatus } = useUserActions();
  const userSocket = useUserSocket();
  const friendSocket = useFriendSocket();
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<{
    [key: string]: boolean;
  }>({
    pending: true,
    invited: true,
    friends: true,
    blocked: false,
  });
  const [selectedFriend, setSelectedFriend] = useState(0);
  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        friendship: Friend;
        handleAction: (friendship: Friend) => void;
      }
    | undefined
  >();
  const [notification, setNotification] = useState<
    | {
        display: boolean;
        level: AlertColor;
        message: string;
      }
    | undefined
  >();

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

  function displayNotification(level: AlertColor, message: string): void {
    setNotification({
      display: true,
      level: level,
      message: message,
    });
  }

  function acceptFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.ACCEPT);
    changeFriend(
      request.incoming_friend.id,
      FriendStatus.PENDING,
      FriendStatus.FRIENDS,
    );
    friendSocket.emit('acceptRequest', request);
    displayNotification('success', 'Request accepted');
  }

  function rejectFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.REJECT);
    deleteFriend(request.incoming_friend.id);
    friendSocket.emit('rejectRequest', request);
    displayNotification('error', 'Request rejected');
  }

  function removeFriendRequest(request: Friend): void {
    callFriendsAPI('DELETE', request.incoming_friend);
    deleteFriend(request.incoming_friend.id);
    friendSocket.emit('deleteRequest', request);
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
    callFriendsAPI('DELETE', friendship.incoming_friend, FriendAction.REMOVE);
    deleteFriend(friendship.incoming_friend.id);
    displayNotification(
      'error',
      'Unfriended ' + friendship.incoming_friend.username,
    );
  }

  useEffect(() => {
    async function getFriends(): Promise<void> {
      const data = JSON.parse(
        await callAPI(
          'GET',
          `friends?search_type=USER&search_number=${currentUser.id}`,
        ),
      );
      setFriends(data);
      addUserStatus(
        userSocket,
        data.map((friend: Friend) => friend.incoming_friend.id),
      );
    }
    getFriends();

    friendSocket.on('newRequest', (request: Friend) => {
      displayNotification('info', 'New friend request!');
    });

    friendSocket.on('acceptRequest', (sender: User) => {
      displayNotification(
        'success',
        sender.username + ' accepted your friend request!',
      );
    });

    friendSocket.on('rejectRequest', (sender: User) => {
      displayNotification(
        'error',
        sender.username + ' rejected your friend request!',
      );
    });

    return () => {
      friendSocket.off('newRequest');
      friendSocket.off('acceptRequest');
      friendSocket.off('rejectRequest');
    };
  }, []);

  useEffect(() => {
    addUserStatus(
      userSocket,
      friends.map((friend: Friend) => friend.incoming_friend.id),
    );
  }, [friends.length]);

  async function sendFriendRequest(): Promise<string> {
    return fetch(
      'http://localhost:4242/api/users?search_type=NAME&search_string=' +
        username,
      {
        cache: 'no-store',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    ).then(async (res) => {
      if (!res.ok) {
        return 'User not found';
      }

      const new_friend = await res.json();
      const friendship = friends.find(
        (friend: Friend) => friend.incoming_friend.id === new_friend.id,
      );

      switch (friendship?.status) {
        case FriendStatus.FRIENDS:
          return 'User is already a friend';
        case FriendStatus.PENDING:
          return 'User already invited you';
        case FriendStatus.INVITED:
          return 'User already invited';
        case FriendStatus.BLOCKED:
          return 'User already blocked';
        default: {
          const new_requests = JSON.parse(
            await callFriendsAPI('POST', new_friend),
          );

          addFriend(new_requests[0]);
          friendSocket.emit('newRequest', new_requests[1]);
          addUserStatus(userSocket, [new_friend.id]);
          displayNotification('success', 'Request sent');
          return '';
        }
      }
    });
  }

  function displayConfirmation(
    titleAction: string,
    description: string,
    friendship: Friend,
    handleAction: (friendship: Friend) => void,
  ): void {
    setConfirmation({
      required: true,
      title: titleAction + friendship.incoming_friend.username + '?',
      description: description,
      friendship: friendship,
      handleAction: handleAction,
    });
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

  function toggleDropdown(category: string): void {
    setDropdownOpen((dropdownOpen: { [key: string]: boolean }) => ({
      ...dropdownOpen,
      [category]: !dropdownOpen[category],
    }));
  }

  const categories = ['friends', 'pending', 'invited', 'blocked'];

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
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
        handleAction={sendFriendRequest}
      />
      {categories.map((category, index) => (
        <FriendDropdown
          key={index}
          category={category}
          open={dropdownOpen[category]}
          friends={friends.filter(
            (friend: Friend) => friend.status === category.toUpperCase(),
          )}
          toggleDropdown={toggleDropdown}
          handleAction={handleAction}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friendsStatus={userStatus}
        />
      ))}
      {confirmation && (
        <ConfirmationPrompt
          open={confirmation.required}
          onCloseHandler={() => {
            setConfirmation(undefined);
          }}
          promptTitle={confirmation.title}
          promptDescription={confirmation.description}
          handleAction={() => {
            confirmation.handleAction(confirmation.friendship);
            setConfirmation(undefined);
          }}
        />
      )}
      {notification && (
        <NotificationBar
          display={notification.display}
          level={notification.level}
          message={notification.message}
          onCloseHandler={() => {
            setNotification(undefined);
          }}
        />
      )}
    </Stack>
  );
}
