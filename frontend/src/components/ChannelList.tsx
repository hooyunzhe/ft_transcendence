'use client';
import List from '@mui/material/List';
import { ChannelDisplay } from './ChannelDisplay';
import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import DialogPrompt from './DialogPrompt';
import Channel from '@/types/Channel';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState('public');
  const [channelName, setChannelName] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  async function addChannel(password?: string) {
    // checking naming duplicate
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

  async function handlePromptAction(input: string) {
    setChannelName(input);
    if (channelType === 'public') {
      addChannel();
    } else {
      console.log('derp');
      setIsProtected(true);
    }
    return true;
  }

  // Create Channel (public) => (channelName) => {addChannel}
  // Next (public) => (channelName) => {setChannelName(channelName), setIsProtected(true)}
  // Create Channel (protected) => (password) => {addChannel(password)}

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
        {isProtected ? (
          // protected
          <DialogPrompt
            buttonText='Add channel'
            dialogTitle='Set channel password'
            dialogDescription='Enter the channel password of your desire.'
            labelText='Password'
            actionButtonText={'Create'}
            // Next
            actionHandler={async () => {
              return false;
            }}
            successMessage='Channel added'
            errorMessage='Channel already exists'
          ></DialogPrompt>
        ) : (
          // public
          <DialogPrompt
            buttonText='Add channel'
            dialogTitle='Channel creation'
            dialogDescription='Create your channel here'
            labelText='Channel name...'
            actionButtonText={channelType === 'public' ? 'Create' : 'Next'}
            // add channel if not add protected
            actionHandler={handlePromptAction}
            successMessage='Channel added'
            errorMessage='Channel already exists'
          >
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleChange}></Switch>}
                label={channelType}
              />
            </FormGroup>
          </DialogPrompt>
        )}
      </Grid>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {channels.map((obj: Channel, index: number) => (
          <ChannelDisplay key={index} {...obj}></ChannelDisplay>
        ))}
      </List>
    </>
  );
}
