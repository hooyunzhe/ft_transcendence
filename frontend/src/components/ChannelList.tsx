'use client';
import List from '@mui/material/List';
import { Channel, ChannelVar } from './Channel';
import call_API from '@/lib/call_API';

export async function ChannelList({ API }: { API: string }) {
  const data = await call_API(API);
  console.log('channel');
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {data.map((obj: ChannelVar, index: number) => (
        <Channel {...obj}></Channel>
      ))}
    </List>
  );
}
