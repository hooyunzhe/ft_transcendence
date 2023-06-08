'use client';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendPrompt from './FriendPrompt';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { friendsSocket } from '@/lib/socket';
import Friend from '@/types/Friend';
import User from '@/types/User';

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

  const current_user: User = {
    id: 4,
    username: 'Test',
    refresh_token: 'test_token',
    date_of_creation: new Date(),
  };

  function callFriendsAPI(
    incoming_id: number,
    action: 'new' | 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ) {
    callAPI(
      action === 'new' ? 'POST' : action === 'delete' ? 'DELETE' : 'PATCH',
      'friends',
      {
        outgoing_id: current_user.id,
        incoming_id: incoming_id,
        ...(action !== 'new' && action !== 'delete' && { action: action }),
      },
    );
  }

  function addRequest(incoming_user: User, direction: 'outgoing' | 'incoming') {
    setFriends((friends) => [
      ...friends,
      {
        id: friends.length + 1,
        outgoing_friend: current_user,
        incoming_friend: incoming_user,
        status: direction === 'outgoing' ? 'invited' : 'pending',
      },
    ]);
  }

  function changeRequest(
    incoming_user: User,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ) {
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

  function addStatus(user_ids: number[]) {
    friendsSocket.emit(
      'getStatus',
      { user_ids: user_ids },
      (data: { [key: number]: string }) => {
        setFriendsStatus((friendsStatus) => ({ ...friendsStatus, ...data }));
      },
    );
  }

  function changeStatus(user_id: number, new_status: 'online' | 'offline') {
    setFriendsStatus((friendsStatus) => ({
      ...friendsStatus,
      [user_id]: new_status,
    }));
  }

  function emitRequest(
    receiver_id: number,
    action: 'new' | 'accept' | 'reject' | 'delete',
  ) {
    friendsSocket.emit(action + 'Request', {
      sender: current_user,
      receiver: { id: receiver_id },
    });
  }

  useEffect(() => {
    async function getFriends() {
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

    friendsSocket.on('newRequest', (sender: User) => {
      addRequest(sender, 'incoming');
      addStatus([sender.id]);
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

  async function addFriend(username: string) {
    return callAPI('GET', 'users/username/' + username).then((data) => {
      if (!data.length) {
        return false;
      } else {
        const new_friend = JSON.parse(data);
        callFriendsAPI(new_friend.id, 'new');
        addRequest(new_friend, 'outgoing');
        emitRequest(new_friend.id, 'new');
        addStatus([new_friend.id]);
        return true;
      }
    });
  }

  function handleRequest(
    request: Friend,
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ) {
    callFriendsAPI(request.incoming_friend.id, action);
    changeRequest(request.incoming_friend, action);
    if (action !== 'block' && action !== 'unblock')
      emitRequest(request.incoming_friend.id, action);
  }

  function toggleDropdown(category: string) {
    setDropdownOpen((dropdownOpen) => ({
      ...dropdownOpen,
      [category]: !dropdownOpen[category],
    }));
  }

  const categories = ['pending', 'invited', 'friends', 'blocked'];

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
          handleRequest={handleRequest}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friendsStatus={friendsStatus}
        ></FriendDropdown>
      ))}
    </Stack>
  );
}
