import DialogPrompt from '../utils/DialogPrompt';
import { useState } from 'react';

interface ChannelNameChangeProps {
  channelID: number;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelNameChangePrompt({
  channelID,
  handleAction,
}: ChannelNameChangeProps) {
  const [input, setInput] = useState('');

  return (
    <DialogPrompt
      buttonText='Change channel Name'
      dialogTitle='Change Channel Name'
      dialogDescription='Please provide name you want to change to.'
      labelText='channel name'
      textInput={input}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setInput(input);
      }}
      backHandler={async () => {}}
      actionButtonText='Change'
      handleAction={async () => {
        handleAction(channelID, input);
        return '';
      }}
    ></DialogPrompt>
  );
}
