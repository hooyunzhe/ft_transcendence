'use client';
import List from '@mui/material/List';
import { ChannelDisplay } from './ChannelDisplay';
import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import DialogPrompt from './utils/DialogPrompt';
import Channel from '@/types/Channel';

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelType, setChannelType] = useState('public');
  const [channelName, setChannelName] = useState('');
  const [channelPass, setChannelPass] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  console.log('-----------Entering ChannelList-------------');

  function findChannelWithName(name: string) {
    return channels.find((channel) => channel.name === name);
    // return channels.some((item) => (item.name === name ? true : false));
  }

  async function createChannel() {
    const foundChannel = findChannelWithName(channelName);

    if (foundChannel) {
      return false;
    } else {
      const newChannel: Channel = JSON.parse(
        await callAPI('POST', 'channels', {
          name: channelName,
          type: channelType,
        }),
      );

      if (newChannel) {
        await callAPI('POST', 'channel_members', {
          channel_id: newChannel.id,
          user_id: 1,
        });

        setChannels([...channels, newChannel]);
      } else {
        console.log('FAILED TO CREATE NEW CHANNEL IN BACKEND');
      }
      return true;
    }
  }

  function joinChannel() {
    const foundChannel = findChannelWithName(channelName);

    if (foundChannel) {
      callAPI('POST', 'channel_members', {
        channel_id: foundChannel.id,
        user_id: 1,
      });
      return true;
    } else {
      return false;
    }
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

    const foundChannel = findChannelWithName(input);
    if (foundChannel) {
      return false;
    }
    if (channelType === 'public') {
      console.log('setIsPublic');
      createChannel();
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
            labelText='Password...'
            textInput={channelPass}
            onChangeHandler={(input) => {
              setChannelPass(input);
            }}
            backButtonText={'Back'}
            backHandler={async () => {
              setIsProtected(false);
              setChannelType('public');
            }}
            actionButtonText={'Create'}
            actionHandler={async () => {
              setIsProtected(false);
              setChannelType('public');
              return createChannel();
            }}
            errorMessage='Channel already exists'
          ></DialogPrompt>
        ) : (
          // 1st page
          <DialogPrompt
            buttonText='Add channel'
            dialogTitle='Channel creation'
            dialogDescription='Create your channel here'
            labelText='Channel name...'
            textInput={channelName}
            onChangeHandler={(input) => {
              setChannelName(input);
            }}
            actionButtonText={channelType === 'public' ? 'Create' : 'Next'}
            backButtonText={'Cancel'}
            backHandler={async () => {
              setChannelType('public');
            }}
            // add channel if not add protected
            actionHandler={handlePromptAction}
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
