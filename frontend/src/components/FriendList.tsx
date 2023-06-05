'use client';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendDropdown from './FriendDropdown';
import callAPI from '@/lib/callAPI';
import { friendsSocket } from '@/lib/socket';
import Friend from '@/types/Friend';
import User from '@/types/User';

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsStatus, setFriendsStatus] = useState<{
    [key: number]: string;
  }>({});
  const [selectedFriend, setSelectedFriend] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const current_user: User = {
    id: 4,
    username: 'Test',
    refresh_token: 'test_token',
    date_of_creation: new Date(),
  };

  function callFriendsAPI(
    incoming_id: number,
    action: 'new' | 'accept' | 'reject' | 'delete',
  ) {
    callAPI(
      action === 'new' ? 'POST' : action === 'delete' ? 'DELETE' : 'PATCH',
      'friends',
      {
        outgoing_id: current_user.id,
        incoming_id: incoming_id,
        ...((action === 'accept' || action === 'reject') && { action: action }),
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
    action: 'accept' | 'reject' | 'delete',
  ) {
    setFriends((friends) => {
      if (action === 'accept') {
        return friends.map((friend) => {
          if (
            friend.incoming_friend.id === incoming_user.id &&
            (friend.status === 'invited' || friend.status === 'pending')
          ) {
            friend.status = 'friends';
          }
          return friend;
        });
      } else {
        return friends.filter(
          (friend) => friend.incoming_friend.id !== incoming_user.id,
        );
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

  function addFriend() {
    const new_friend: User = {
      id: 1,
      username: 'test',
      refresh_token: 'test_token',
      date_of_creation: new Date(),
    };

    callFriendsAPI(new_friend.id, 'new');
    addRequest(new_friend, 'outgoing');
    emitRequest(new_friend.id, 'new');
    addStatus([new_friend.id]);
  }

  function handleRequest(
    request: Friend,
    action: 'accept' | 'reject' | 'delete',
  ) {
    callFriendsAPI(request.incoming_friend.id, action);
    changeRequest(request.incoming_friend, action);
    emitRequest(request.incoming_friend.id, action);
  }

  function toggleDropdown(category: string) {
    setDropdownOpen((dropdownOpen) => ({
      ...dropdownOpen,
      [category]: !dropdownOpen[category],
    }));
  }

  const categories = ['pending', 'invited', 'friends'];

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <Button variant='contained' onClick={addFriend}>
        Add Friend
      </Button>
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
