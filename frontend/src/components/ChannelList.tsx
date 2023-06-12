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

  console.log('-----------Entering ChannelList-------------');

  function checkChannelDuplicate(name: string) {
    return channels.some((item) => (item.name === name ? true : false));
  }

  async function addChannel(channelName: string, password?: string) {
    console.log('Entering addChannel()');
    const hasChannel = checkChannelDuplicate(channelName);
    console.log('hasChannel: ' + hasChannel);

    // probably need to check the channelData here me thinks
    if (hasChannel === false) {
      const channelData = JSON.parse(
        await callAPI('POST', 'channels', {
          name: channelName,
          type: channelType,
        }),
      );

      console.log('channelName: ' + channelName);
      await callAPI('GET', 'channels/name/' + channelName).then((data) => {
        const new_channel = JSON.parse(data);
        if (new_channel) {
          setChannels([...channels, new_channel]);
        }
      });
      console.log('true');
      return true;
    }
    console.log('false');
    return false;
  }

  function handleChange(event: any) {
    channelType === 'public'
      ? setChannelType('protected')
      : setChannelType('public');
  }

  async function handlePromptAction(input: string) {
    console.log('--------HANDLE PROMPT ACTION--------');
    console.log('channeltype: ' + channelType);
    console.log('input:' + input);

    const hasDuplicate = checkChannelDuplicate(input);
    console.log(hasDuplicate);
    if (hasDuplicate) {
      return false;
    }
    if (channelType === 'public') {
      console.log('setIsPublic');
      addChannel(input);
    } else {
      console.log('setIsProtected');
      setChannelName(input);
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
          // 2nd page
          <DialogPrompt
            buttonText='Add channel'
            dialogTitle='Set channel password'
            dialogDescription='Enter the channel password of your desire.'
            labelText='Password'
            backButtonText={'Back'}
            backHandler={async () => {
              setIsProtected(false);
              setChannelType('public');
            }}
            actionButtonText={'Create'}
            actionHandler={async (input) => {
              // hash input later
              setIsProtected(false);
              setChannelType('public');
              return addChannel(channelName, input);
            }}
            successMessage='Channel added'
            errorMessage='Channel already exists'
          ></DialogPrompt>
        ) : (
          // 1st page
          <DialogPrompt
            buttonText='Add channel'
            dialogTitle='Channel creation'
            dialogDescription='Create your channel here'
            labelText='Channel name...'
            actionButtonText={channelType === 'public' ? 'Create' : 'Next'}
            backButtonText={'Cancel'}
            backHandler={async () => {
              setChannelType('public');
            }}
            // add channel if not add protected
            actionHandler={handlePromptAction}
            successMessage='Channel added'
            errorMessage='Channel already exists'
          >
            <FormGroup>
              <FormControlLabel
                // this is the children
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
