'use client';

import { List } from '@mui/material';
import { Friend, FriendVar } from './Friend';
import call_API from '@/lib/call_API';

export async function FriendList({ API }: { API: string }) {
  const data = await call_API(API);
  console.log('friend');

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {data.map((obj: FriendVar, index: number) => (
        <Friend {...obj}></Friend>
      ))}
    </List>
  );
}
