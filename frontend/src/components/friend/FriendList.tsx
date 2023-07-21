'use client';
import { AlertColor, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { friendsSocket } from '@/lib/socket';
import { Friend, FriendStatus, FriendAction } from '@/types/FriendTypes';
import { User } from '@/types/UserTypes';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import NotificationBar from '../utils/NotificationBar';
import DialogPrompt from '../utils/DialogPrompt';

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsStatus, setFriendsStatus] = useState<{
    [key: number]: string;
  }>({});
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

  const current_user: User = {
    id: 4,
    username: 'Test',
    refresh_token: 'test_token',
    date_of_creation: new Date(),
  };

  async function callFriendsAPI(
    method: string,
    incoming_friend: User,
    action?: FriendAction,
  ): Promise<string> {
    return callAPI(method, 'friends', {
      outgoing_id: current_user.id,
      incoming_id: incoming_friend.id,
      ...(action && { action: action }),
    });
  }

  function changeFriend(
    incoming_friend: User,
    current_status: FriendStatus,
    new_status: FriendStatus,
  ): void {
    setFriends((friends: Friend[]) =>
      friends.map((friend) => {
        if (
          friend.incoming_friend.id === incoming_friend.id &&
          friend.status === current_status
        ) {
          friend.status = new_status;
        }
        return friend;
      }),
    );
  }

  function deleteFriend(incoming_friend: User): void {
    setFriends((friends: Friend[]) =>
      friends.filter(
        (friend) => friend.incoming_friend.id !== incoming_friend.id,
      ),
    );
  }

  function addStatus(user_ids: number[]): void {
    friendsSocket.emit(
      'getStatus',
      { user_ids: user_ids },
      (data: { [key: number]: string }) => {
        setFriendsStatus((friendsStatus: { [key: number]: string }) => ({
          ...friendsStatus,
          ...data,
        }));
      },
    );
  }

  function changeStatus(
    user_id: number,
    new_status: 'online' | 'offline',
  ): void {
    setFriendsStatus((friendsStatus: { [key: number]: string }) => ({
      ...friendsStatus,
      [user_id]: new_status,
    }));
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
      request.incoming_friend,
      FriendStatus.PENDING,
      FriendStatus.FRIENDS,
    );
    friendsSocket.emit('acceptRequest', request);
    displayNotification('success', 'Request accepted');
  }

  function rejectFriendRequest(request: Friend): void {
    callFriendsAPI('PATCH', request.incoming_friend, FriendAction.REJECT);
    deleteFriend(request.incoming_friend);
    friendsSocket.emit('rejectRequest', request);
    displayNotification('error', 'Request rejected');
  }

  function removeFriendRequest(request: Friend): void {
    callFriendsAPI('DELETE', request.incoming_friend);
    deleteFriend(request.incoming_friend);
    friendsSocket.emit('deleteRequest', request);
    displayNotification('error', 'Request removed');
  }

  function blockFriend(friendship: Friend): void {
    callFriendsAPI('PATCH', friendship.incoming_friend, FriendAction.BLOCK);
    changeFriend(
      friendship.incoming_friend,
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
      friendship.incoming_friend,
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
    deleteFriend(friendship.incoming_friend);
    displayNotification(
      'error',
      'Unfriended ' + friendship.incoming_friend.username,
    );
  }

  useEffect(() => {
    async function getFriends(): Promise<void> {
      const data = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=4'),
      );
      setFriends(data);
      addStatus(data.map((friend: Friend) => friend.incoming_friend.id));
    }
    getFriends();

    friendsSocket.on('newConnection', (user_id: number) => {
      changeStatus(user_id, 'online');
    });

    friendsSocket.on('newDisconnect', (user_id: number) => {
      changeStatus(user_id, 'offline');
    });

    friendsSocket.on('newRequest', (request: Friend) => {
      setFriends((friends: Friend[]) => [...friends, request]);
      addStatus([request.incoming_friend.id]);
      displayNotification('info', 'New friend request!');
    });

    friendsSocket.on('deleteRequest', (sender: User) => {
      deleteFriend(sender);
    });

    friendsSocket.on('acceptRequest', (sender: User) => {
      changeFriend(sender, FriendStatus.INVITED, FriendStatus.FRIENDS);
      displayNotification(
        'success',
        sender.username + ' accepted your friend request!',
      );
    });

    friendsSocket.on('rejectRequest', (sender: User) => {
      deleteFriend(sender);
      displayNotification(
        'error',
        sender.username + ' rejected your friend request!',
      );
    });

    return () => {
      friendsSocket.off('newConnection');
      friendsSocket.off('newDisconnect');
      friendsSocket.off('newRequest');
      friendsSocket.off('deleteRequest');
      friendsSocket.off('acceptRequest');
      friendsSocket.off('rejectRequest');
    };
  }, []);

  async function addFriend(): Promise<string> {
    return callAPI('GET', 'users/username/' + username).then(async (data) => {
      if (!data.length) {
        return 'User not found';
      }
      const new_friend = JSON.parse(data);
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

          setFriends((friends: Friend[]) => [...friends, new_requests[0]]);
          friendsSocket.emit('newRequest', new_requests[1]);
          addStatus([new_friend.id]);
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
        handleAction={addFriend}
      />
      {categories.map((category, index) => (
        <FriendDropdown
          key={index}
          category={category}
          open={dropdownOpen[category]}
          friends={friends.filter(
            (friend: Friend) => friend.status === category,
          )}
          toggleDropdown={toggleDropdown}
          handleAction={handleAction}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friendsStatus={friendsStatus}
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
