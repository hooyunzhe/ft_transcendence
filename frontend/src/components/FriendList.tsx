'use client';

import { List } from '@mui/material';
import { Friend, FriendVar } from './Friend';
import call_API from '@/lib/call_API';
import { useEffect, useState } from 'react';

export function FriendList({ API }: { API: string }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function getFriend() {
      const data = await call_API(API);
      setFriends(data);
    }
    getFriend();
  }, []);

  console.log(' --- friend ---\n');

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {friends.map((obj: FriendVar, index: number) => (
        <Friend key={index} {...obj}></Friend>
      ))}
    </List>
  );
}
