'use client';
import { Button, ListItemButton, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import FriendDisplay from './FriendDisplay';
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
  const [pendingOpen, setPendingOpen] = useState(false);
  const [invitedOpen, setInvitedOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

  const current_user: User = {
    id: 4,
    username: 'Test',
    refresh_token: 'test_token',
    date_of_creation: new Date(),
  };

  useEffect(() => {
    async function getFriends() {
      const data = JSON.parse(
        await callAPI('GET', 'friends/user?outgoing_id=4'),
      );
      setFriends(data);
      friendsSocket.emit(
        'getStatus',
        { user_ids: data.map((friend: Friend) => friend.incoming_friend.id) },
        (data: { [key: number]: string }) => {
          setFriendsStatus(data);
        },
      );
    }

    function handleNewConnection(user_id: number) {
      setFriendsStatus((friendsStatus) => ({
        ...friendsStatus,
        [user_id]: 'online',
      }));
    }

    function handleNewDisconnect(user_id: number) {
      setFriendsStatus((friendsStatus) => ({
        ...friendsStatus,
        [user_id]: 'offline',
      }));
    }

    function handleNewRequest(sender: User) {
      setFriends((friends) => [
        ...friends,
        {
          id: friends.length + 1,
          outgoing_friend: current_user,
          incoming_friend: sender,
          status: 'pending',
        },
      ]);
      friendsSocket.emit(
        'checkStatus',
        { user_id: sender.id },
        (data: string) => {
          setFriendsStatus((friendsStatus) => ({
            ...friendsStatus,
            [sender.id]: data,
          }));
        },
      );
    }

    function handleAcceptRequest(sender: User) {
      setFriends((friends) =>
        friends.map((friend) => {
          if (
            friend.incoming_friend.id === sender.id &&
            friend.status === 'invited'
          ) {
            friend.status = 'friend';
          }
          return friend;
        }),
      );
    }

    function handleRejectRequest(sender: User) {
      setFriends((friends) =>
        friends.filter((friend) => friend.incoming_friend.id !== sender.id),
      );
    }

    getFriends();

    friendsSocket.on('newConnection', handleNewConnection);
    friendsSocket.on('newDisconnect', handleNewDisconnect);
    friendsSocket.on('newRequest', handleNewRequest);
    friendsSocket.on('acceptRequest', handleAcceptRequest);
    friendsSocket.on('rejectRequest', handleRejectRequest);

    return () => {
      friendsSocket.off('newConnection', handleNewConnection);
      friendsSocket.off('newDisconnect', handleNewDisconnect);
      friendsSocket.off('newRequest', handleNewRequest);
      friendsSocket.off('acceptRequest', handleAcceptRequest);
      friendsSocket.off('rejectRequest', handleRejectRequest);
    };
  }, []);

  function addFriend() {
    const new_friend: User = {
      id: 1,
      username: 'test',
      refresh_token: 'test_token',
      date_of_creation: new Date(),
    };

    callAPI('POST', 'friends', {
      outgoing_id: 4,
      incoming_id: 1,
      status: 'invited',
    });
    setFriends((friends) => [
      ...friends,
      {
        id: friends.length + 1,
        outgoing_friend: current_user,
        incoming_friend: new_friend,
        status: 'invited',
      },
    ]);
    friendsSocket.emit('newRequest', {
      sender: current_user,
      receiver: {
        id: 1,
      },
    });
    friendsSocket.emit(
      'checkStatus',
      { user_id: new_friend.id },
      (data: string) => {
        setFriendsStatus((friendsStatus) => ({
          ...friendsStatus,
          [new_friend.id]: data,
        }));
      },
    );
  }

  function handleRequest(request: Friend, action: string) {
    if (action === 'delete') {
      callAPI('DELETE', 'friends', {
        outgoing_id: request.outgoing_friend.id,
        incoming_id: request.incoming_friend.id,
      });
    } else {
      callAPI('PATCH', 'friends', {
        outgoing_id: request.outgoing_friend.id,
        incoming_id: request.incoming_friend.id,
        action: action,
      });
    }
    setFriends((friends) => {
      if (action === 'accept') {
        return friends.map((friend) => {
          if (friend.incoming_friend.id === request.incoming_friend.id) {
            friend.status = 'friend';
          }
          return friend;
        });
      } else {
        return friends.filter(
          (friend) => friend.incoming_friend.id !== request.incoming_friend.id,
        );
      }
    });
    friendsSocket.emit(action + 'Request', {
      sender: current_user,
      receiver: { id: request.incoming_friend.id },
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
        {friends.map(
          (friend: Friend, index: number) =>
            friend.status === 'pending' && (
              <Paper elevation={2} sx={{ p: '8px 16px' }}>
                <FriendDisplay
                  key={index}
                  category={'pending'}
                  friend={friend}
                  handleAction={handleRequest}
                ></FriendDisplay>
              </Paper>
            ),
        )}
      </FriendDropdown>
      <FriendDropdown
        category={'Invited'}
        open={invitedOpen}
        setOpen={setInvitedOpen}
      >
        {friends.map(
          (friend: Friend, index: number) =>
            friend.status === 'invited' && (
              <Paper elevation={2} sx={{ p: '8px 16px' }}>
                <FriendDisplay
                  key={index}
                  category={'invited'}
                  friend={friend}
                  handleAction={handleRequest}
                ></FriendDisplay>
              </Paper>
            ),
        )}
      </FriendDropdown>
      <FriendDropdown
        category={'Friends'}
        open={friendsOpen}
        setOpen={setFriendsOpen}
      >
        {friends.map(
          (friend: Friend, index: number) =>
            friend.status === 'friend' && (
              <Paper elevation={2}>
                <ListItemButton
                  selected={selectedFriend === friend.id}
                  onClick={() => setSelectedFriend(friend.id)}
                >
                  <FriendDisplay
                    key={index}
                    category={'friend'}
                    friend={friend}
                    status={friendsStatus[friend.incoming_friend.id]}
                    handleAction={handleRequest}
                  ></FriendDisplay>
                </ListItemButton>
              </Paper>
            ),
        )}
      </FriendDropdown>
    </Stack>
  );
}
