'use client';
import List from '@mui/material/List';
import { ChannelDisplay } from './ChannelDisplay';
import { Grid, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import DialogPrompt from './DialogPrompt';
import Channel from '@/types/Channel';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState('public');

  async function addChannel(channelName: string) {
    const hasChannel = channels.some((item) => {
      if (item.name === channelName) {
        console.log('HELLLLPP');
        return true;
      }
      return false;
    });
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
    console.log(channelName);
    console.log(channelType);
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
          dialogTitle='Add channel here'
          labelText='Enter channel that you wanna add~'
          actionButtonText='ADD NOW!~!!'
          actionHandler={addChannel}
          successMessage='Channel added'
          errorMessage='Channel already exists'
        >
          <Switch
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
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
