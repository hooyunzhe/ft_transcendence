import { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import DialogPrompt from '../utils/DialogPrompt';
import { ChannelType } from '@/types/ChannelTypes';

interface ChannelCreatePromptProps {
  checkChannelExists: (name: string) => boolean;
  checkChannelJoined: (name: string) => boolean;
  createChannel: (...args: any) => Promise<string>;
}

export default function ChannelCreatePrompt({
  checkChannelExists,
  checkChannelJoined,
  createChannel,
}: ChannelCreatePromptProps) {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>(
    ChannelType.PUBLIC,
  );
  const [channelPass, setChannelPass] = useState('');
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);

  function resetDisplay() {
    setDisplayPasswordPrompt(false);
  }

  function resetState() {
    setChannelName('');
    setChannelType(ChannelType.PUBLIC);
    setChannelPass('');
  }

  async function handleCreateChannelAction(): Promise<string> {
    if (checkChannelExists(channelName)) {
      return 'Channel already exists';
    }
    if (checkChannelJoined(channelName)) {
      return 'Already in channel';
    }
    if (channelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      createChannel(channelName, channelType);
      resetState();
    }
    return '';
  }

  return displayPasswordPrompt ? (
    <DialogPrompt
      buttonText='Create channel'
      dialogTitle='Set channel password'
      dialogDescription='Enter the channel password of your desire'
      labelText='Password'
      textInput={channelPass}
      onChangeHandler={(input) => {
        setChannelPass(input);
      }}
      backButtonText='Back'
      backHandler={resetDisplay}
      actionButtonText='Create'
      handleAction={async () => {
        const res = createChannel(channelName, channelType, channelPass);
        resetState();
        resetDisplay();
        return res;
      }}
    />
  ) : (
    <DialogPrompt
      buttonText='Create channel'
      dialogTitle='Channel creation'
      dialogDescription='Create your channel here'
      labelText='Name'
      textInput={channelName}
      onChangeHandler={(input) => {
        setChannelName(input);
      }}
      actionButtonText={
        channelType === ChannelType.PROTECTED ? 'Next' : 'Create'
      }
      backButtonText='Cancel'
      backHandler={resetDisplay}
      handleAction={handleCreateChannelAction}
    >
      <FormControl>
        <FormLabel>Type</FormLabel>
        <RadioGroup
          row
          value={channelType}
          onChange={(event) => {
            setChannelType(event.target.value as ChannelType);
          }}
        >
          <FormControlLabel
            value={ChannelType.PUBLIC}
            control={<Radio />}
            label='Public'
          />
          <FormControlLabel
            value={ChannelType.PRIVATE}
            control={<Radio />}
            label='Private'
          />
          <FormControlLabel
            value={ChannelType.PROTECTED}
            control={<Radio />}
            label='Protected'
          />
        </RadioGroup>
      </FormControl>
    </DialogPrompt>
  );
}
