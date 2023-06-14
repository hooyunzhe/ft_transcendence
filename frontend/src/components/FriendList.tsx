'use client';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendPrompt from './FriendPrompt';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { friendsSocket } from '@/lib/socket';
import Friend from '@/types/Friend';
import User from '@/types/User';
import ConfirmationPrompt from './ConfirmationPrompt';

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsStatus, setFriendsStatus] = useState<{
    [key: number]: string;
  }>({});
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
        request: Friend;
        action: 'block' | 'unblock' | 'delete';
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
    incoming_id: number,
    action: 'new' | 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ): Promise<string> {
    return callAPI(
      action === 'new' ? 'POST' : action === 'delete' ? 'DELETE' : 'PATCH',
      'friends',
      {
        outgoing_id: current_user.id,
        incoming_id: incoming_id,
        ...(action !== 'new' && action !== 'delete' && { action: action }),
      },
    );
  }

  function addRequest(request: Friend): void {
    setFriends((friends) => [...friends, request]);
  }

  function changeRequest(
    incoming_user: User,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ): void {
    setFriends((friends) => {
      if (action === 'delete' || action === 'reject') {
        return friends.filter(
          (friend) => friend.incoming_friend.id !== incoming_user.id,
        );
      } else {
        return friends.map((friend) => {
          if (friend.incoming_friend.id === incoming_user.id) {
            if (friend.status === 'friends' && action === 'block') {
              friend.status = 'blocked';
            }
            if (
              (friend.status === 'blocked' && action === 'unblock') ||
              ((friend.status === 'invited' || friend.status === 'pending') &&
                action === 'accept')
            )
              friend.status = 'friends';
          }
          return friend;
        });
      }
    });
  }

  function addStatus(user_ids: number[]): void {
    friendsSocket.emit(
      'getStatus',
      { user_ids: user_ids },
      (data: { [key: number]: string }) => {
        setFriendsStatus((friendsStatus) => ({ ...friendsStatus, ...data }));
      },
    );
  }

  function changeStatus(
    user_id: number,
    new_status: 'online' | 'offline',
  ): void {
    setFriendsStatus((friendsStatus) => ({
      ...friendsStatus,
      [user_id]: new_status,
    }));
  }

  function emitRequest(
    request: Friend,
    action: 'new' | 'accept' | 'reject' | 'delete',
  ): void {
    friendsSocket.emit(action + 'Request', request);
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
      addRequest(request);
      addStatus([request.incoming_friend.id]);
    });

    friendsSocket.on('acceptRequest', (sender: User) => {
      changeRequest(sender, 'accept');
    });

    friendsSocket.on('rejectRequest', (sender: User) => {
      changeRequest(sender, 'reject');
    });

    return () => {
      friendsSocket.off('newConnection');
      friendsSocket.off('newDisconnect');
      friendsSocket.off('newRequest');
      friendsSocket.off('acceptRequest');
      friendsSocket.off('rejectRequest');
    };
  }, []);

  async function addFriend(username: string): Promise<boolean> {
    return callAPI('GET', 'users/username/' + username).then(async (data) => {
      if (!data.length) {
        return false;
      } else {
        const new_friend = JSON.parse(data);
        const new_requests = JSON.parse(
          await callFriendsAPI(new_friend.id, 'new'),
        );
        addRequest(new_requests[0]);
        emitRequest(new_requests[1], 'new');
        addStatus([new_friend.id]);
        return true;
      }
    });
  }

  function handleAction(
    request: Friend,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ): void {
    if (action === 'accept' || action === 'reject') {
      handleRequest(request, action);
    } else {
      const actionTitle =
        action === 'delete'
          ? 'Unfriend '
          : action.charAt(0).toUpperCase() + action.slice(1) + ' ';

      const actionDescription =
        action === 'delete'
          ? 'This action is permanent!'
          : action === 'block'
          ? 'You will not see ' +
            request.incoming_friend.username +
            "'s messages anymore!"
          : 'You will now see ' +
            request.incoming_friend.username +
            "'s messages!";

      setConfirmation({
        required: true,
        title: actionTitle + request.incoming_friend.username + '?',
        description: actionDescription,
        request: request,
        action: action,
      });
    }
  }

  function handleRequest(
    request: Friend,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ): void {
    callFriendsAPI(request.incoming_friend.id, action);
    changeRequest(request.incoming_friend, action);
    if (action !== 'block' && action !== 'unblock')
      emitRequest(request, action);
  }

  function toggleDropdown(category: string): void {
    setDropdownOpen((dropdownOpen) => ({
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
      <FriendPrompt addFriend={addFriend}></FriendPrompt>
      {categories.map((category, index) => (
        <FriendDropdown
          key={index}
          category={category}
          open={dropdownOpen[category]}
          friends={friends.filter((friend) => friend.status === category)}
          toggleDropdown={toggleDropdown}
          handleAction={handleAction}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friendsStatus={friendsStatus}
        ></FriendDropdown>
      ))}
      {confirmation && (
        <ConfirmationPrompt
          open={confirmation.required}
          onCloseHandler={() => {
            setConfirmation(undefined);
          }}
          promptTitle={confirmation.title}
          promptDescription={confirmation.description}
          actionHandler={() => {
            handleRequest(confirmation.request, confirmation.action);
            setConfirmation(undefined);
          }}
        ></ConfirmationPrompt>
      )}
    </Stack>
  );
}
