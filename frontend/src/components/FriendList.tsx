'use client';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FriendDisplay } from './FriendDisplay';
import callAPI from '@/lib/callAPI';
import { Friend } from '@/types/Friend';
import { User } from '@/types/User';
import { friends_socket } from '@/lib/socket';

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState(0);

  useEffect(() => {
    async function getFriend() {
      const data = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=4'),
      );

      console.log(data);
      setFriends(data);
    }
    getFriend();

    let current_user: User = {
      id: 4,
      username: 'Test',
      refresh_token: 'test_token',
      date_of_creation: new Date(),
    };

    function handleNewRequest(sender: User) {
      setFriends((friends) => {
        return [
          ...friends,
          {
            id: friends.length + 1,
            status: 'pending',
            outgoing_friend: current_user,
            incoming_friend: sender,
          },
        ];
      });
    }

    friends_socket.on('newRequest', handleNewRequest);

    return () => {
      friends_socket.off('newRequest', handleNewRequest);
    };
  }, []);

  return (
    <Stack
      width='100%'
      maxWidth={360}
      direction='column'
      justifyContent='center'
      spacing={1}
    >
      <Button variant='contained'>Add Friend</Button>
      {friends.map((obj: Friend, index: number) => (
        <FriendDisplay
          key={index}
          friend={obj}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
        ></FriendDisplay>
      ))}
    </Stack>
  );
}
