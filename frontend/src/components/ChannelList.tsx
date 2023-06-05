'use client';
import List from '@mui/material/List';
import { Channel, ChannelVar } from './Channel';
import call_API from '@/lib/call_API';
import { Button, FormControl, Grid, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from 'react';


export async function ChannelList({ API }: { API: string }) {

  const [message, setMessage] = useState('');

  const data = await call_API(API);
  console.log('channel');
  return (
    <>
      <Grid sx={{ width: '100%', maxWidth: 360}} xs={8} item>
        <FormControl>
          <TextField
            onChange={(event: any) => {
              setMessage(event.target.value);
              console.log('changed');
            }}
            value={message}
            label='Add Channel Here...'
            variant='outlined'
          />
        </FormControl>
        <IconButton>
          <AddCircleOutlineIcon />
        </IconButton>
      </Grid>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {data.map((obj: ChannelVar, index: number) => (
        <Channel {...obj}></Channel>
        ))}
      </List>
    </>
  );
}
