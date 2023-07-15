import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import DialogPrompt from '../utils/DialogPrompt';
import { useState } from 'react';
import { Channel, ChannelType } from '@/types/ChannelTypes';

interface ChannelTypeChangeProps {
  channel: Channel;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelTypeChangePrompt({
  channel,
  handleAction,
}: ChannelTypeChangeProps) {
  const [input, setInput] = useState('');
  const [currentChannel, setCurrentChannel] = useState(channel.type);

  return (
    <>
      <DialogPrompt
        disableText={currentChannel !== ChannelType.PROTECTED}
        buttonText='Change Channel Type'
        dialogTitle='Change Channel Type'
        dialogDescription='Please provide type you want to change to.'
        labelText='Channel Password'
        textInput={currentChannel === ChannelType.PROTECTED ? input : ''}
        backButtonText='Cancel'
        onChangeHandler={(input) => {
          setInput(input);
        }}
        backHandler={async () => {}}
        actionButtonText='Change'
        handleAction={async () => {
          console.log(input);
          handleAction(channel.id, currentChannel, input);
          return '';
        }}
      >
        <FormControl>
          <RadioGroup
            row
            defaultValue={channel.type}
            onChange={(event) => {
              setCurrentChannel(event.target.value as ChannelType);
            }}
          >
            <FormControlLabel
              value={ChannelType.PUBLIC}
              control={<Radio />}
              label='Public'
            />
            <FormControlLabel
              value={ChannelType.PROTECTED}
              control={<Radio />}
              label='Protected'
            />
            <FormControlLabel
              value={ChannelType.PRIVATE}
              control={<Radio />}
              label='Private'
            />
          </RadioGroup>
        </FormControl>
      </DialogPrompt>
    </>
  );
}
