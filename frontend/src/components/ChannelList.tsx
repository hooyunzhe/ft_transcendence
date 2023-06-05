'use client';
import List from '@mui/material/List';
import { Channel, ChannelVar } from './Channel';
import { Button, FormControl, Grid, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';


export async function ChannelList({ channelAPI }: { channelAPI: string }) {

  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    async function getChannels() {
      const messageData = JSON.parse(await callAPI('GET', channelAPI));
      setChannels(messageData);
      console.log(messageData);
    }
    getChannels();
  }, []);
  

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
      {channels.map((obj: ChannelVar, index: number) => (
        <Channel {...obj}></Channel>
        ))}
      </List>
    </>
  );
}
