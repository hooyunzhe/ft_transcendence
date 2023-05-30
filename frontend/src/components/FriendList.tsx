'use client';

import { List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FriendDisplay } from './FriendDisplay';
import call_API from '@/lib/call_API';
import { Friend } from '@/types/Friend';
import { User } from '@/types/User';

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    async function getFriend() {
      const data = JSON.parse(
        await call_API('friends/user?outgoing_id=4', 'GET'),
      );

      console.log(data);
      setFriends(data);
    }
    getFriend();

    const socket = io('http://localhost:4242/gateway/friends', {
      query: {
        id: 4,
      },
    });

    // socket.on('newConnection', (data) => {
    //   console.log(data);
    // });
    // socket.on('newDisconnect', (data) => {
    //   console.log(data);
    // });
    // socket.emit('checkStatus', { user_ids: [1, 2, 3, 5] }, (data: any) => {
    //   console.log(data);
    // });

    let current_user: User = {
      id: 4,
      username: 'Test',
      refresh_token: 'test_token',
      date_of_creation: new Date(),
    };

    async function addRequest(id: number) {
      const outgoing_user = JSON.parse(
        await call_API('users/' + String(id), 'GET'),
      );

      setFriends([
        ...friends,
        {
          id: friends.length + 1,
          status: 'pending',
          outgoing_friend: outgoing_user,
          incoming_friend: current_user,
        },
      ]);
    }

    socket.on('newRequest', (data) => {
      console.log('incoming request from user with id %d', data);
      addRequest(data);
    });
  }, []);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {friends.map((obj: Friend, index: number) => (
        <FriendDisplay key={index} {...obj}></FriendDisplay>
      ))}
    </List>
  );
}
