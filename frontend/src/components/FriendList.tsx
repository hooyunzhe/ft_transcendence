'use client';
import { Button, Collapse, List, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FriendDisplay } from './FriendDisplay';
import callAPI from '@/lib/callAPI';
import { Friend } from '@/types/Friend';
import { User } from '@/types/User';
import { friends_socket } from '@/lib/socket';
import FriendDropdown from './FriendDropdown';

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState(0);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

  const current_user: User = {
    id: 4,
    username: 'Test',
    refresh_token: 'test_token',
    date_of_creation: new Date(),
  };

  useEffect(() => {
    async function getFriend() {
      const data = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=4'),
      );

      console.log(data);
      setFriends(data);
    }
    getFriend();

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

  function addFriend() {
    callAPI('POST', 'friends', {
      outgoing_id: 4,
      incoming_id: 1,
      status: 'invited',
    });
    friends_socket.emit('newRequest', {
      sender: current_user,
      receiver: {
        id: 1,
      },
    });
  }

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
      <FriendDropdown
        category={'Pending'}
        open={pendingOpen}
        setOpen={setPendingOpen}
      >
        <Collapse in={pendingOpen} timeout='auto' unmountOnExit>
          <List>
            {friends.map(
              (friend: Friend, index: number) =>
                friend.status === 'pending' && (
                  <FriendDisplay
                    key={index}
                    friend={friend}
                    selectedFriend={selectedFriend}
                    setSelectedFriend={setSelectedFriend}
                  ></FriendDisplay>
                ),
            )}
          </List>
        </Collapse>
      </FriendDropdown>
      <FriendDropdown category={'Sent'} open={sentOpen} setOpen={setSentOpen}>
        <Collapse in={sentOpen} timeout='auto' unmountOnExit>
          <List>
            {friends.map(
              (friend: Friend, index: number) =>
                friend.status === 'invited' && (
                  <FriendDisplay
                    key={index}
                    friend={friend}
                    selectedFriend={selectedFriend}
                    setSelectedFriend={setSelectedFriend}
                  ></FriendDisplay>
                ),
            )}
          </List>
        </Collapse>
      </FriendDropdown>
      <FriendDropdown
        category={'Friends'}
        open={friendsOpen}
        setOpen={setFriendsOpen}
      >
        <Collapse in={friendsOpen} timeout='auto' unmountOnExit>
          <List>
            {friends.map(
              (friend: Friend, index: number) =>
                friend.status === 'friend' && (
                  <FriendDisplay
                    key={index}
                    friend={friend}
                    selectedFriend={selectedFriend}
                    setSelectedFriend={setSelectedFriend}
                  ></FriendDisplay>
                ),
            )}
          </List>
        </Collapse>
      </FriendDropdown>
    </Stack>
  );
}
