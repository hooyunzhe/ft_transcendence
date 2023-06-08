'use client';
import List from '@mui/material/List';
import { ChannelDisplay } from './ChannelDisplay';
import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import DialogPrompt from './DialogPrompt';
import Channel from '@/types/Channel';
import { NewReleasesRounded } from '@mui/icons-material';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState('public');
  const [input, setInput] = useState('');

  async function addChannel(channelName: string) {
    const hasChannel = channels.some((item) => {
      if (item.name === channelName) {
        return true;
      }
      return false;
    });

    // probably need to check the channelData here me thinks
    if (hasChannel === false) {
      const channelData = JSON.parse(
        await callAPI('POST', 'channels', {
          name: channelName,
          type: channelType,
        }),
      );

      callAPI('GET', 'channels/name/' + channelName).then((data) => {
        const new_channel = JSON.parse(data);
        if (new_channel) {
          setChannels([...channels, new_channel]);
        }
      });
      return true;
    }
    return false;
  }

  function handleChange(event: any) {
    if (channelType === 'public') setChannelType('protected');
    else if (channelType === 'protected') setChannelType('public');
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
          buttonText='Add channel'
          dialogTitle='Channel creation'
          labelText='Channel name...'
          actionButtonText='ADD NOW!~!!'
          actionHandler={addChannel}
          successMessage='Channel added'
          errorMessage='Channel already exists'
        >
          <FormGroup>
            <FormControlLabel
              control={<Switch onChange={handleChange}></Switch>}
              label={channelType}
            />
          </FormGroup>
          <TextField
            sx={{ width: '70%', height: '30%' }}
            autoFocus
            margin='dense'
            id='input'
            label='Please key in password...'
            variant='standard'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            disabled={channelType === 'public'}
            required
          ></TextField>
        </DialogPrompt>
      </Grid>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {channels.map((obj: Channel, index: number) => (
          <ChannelDisplay key={index} {...obj}></ChannelDisplay>
        ))}
      </List>
    </>
  );
}
