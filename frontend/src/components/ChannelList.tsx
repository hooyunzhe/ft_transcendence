'use client';
import List from '@mui/material/List';
import { ChannelDisplay } from './ChannelDisplay';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import DialogPrompt from './DialogPrompt';
import Channel from '@/types/Channel';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState('public');

  async function addChannel(channelName: string) {
    const channelData = JSON.parse(
      await callAPI('POST', 'channels', {
        name: channelName,
        type: channelType,
      }),
    );
    callAPI('GET', 'channels/name/' + channels).then((data) => {
      const new_channel = JSON.parse(data);
      if (new_channel) {
        setChannels((channels: Channel[]) => [...channels, new_channel]);
      }
    });
    return false;
  }

  function handleChange() {
    setChannelType('protected');
  }

  useEffect(() => {
    async function getChannels() {
      const channelData = JSON.parse(await callAPI('GET', 'channels'));
      setChannels(channelData);
      console.log(channelData);
    }
    getChannels();
  }, []);

  return (
    <>
      <Grid sx={{ width: '100%', maxWidth: 360 }} xs={8} item>
        <DialogPrompt
          buttonText='test'
          dialogTitle='test2'
          labelText='test3'
          actionButtonText='test4'
          actionHandler={addChannel}
          successMessage='Channel added'
          errorMessage='Channel already exists'
        >
          <Switch
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </DialogPrompt>
        {/* <FormControl>
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
        </IconButton> */}
      </Grid>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {channels.map((obj: Channel, index: number) => (
          <ChannelDisplay {...obj}></ChannelDisplay>
        ))}
      </List>
    </>
  );
}
